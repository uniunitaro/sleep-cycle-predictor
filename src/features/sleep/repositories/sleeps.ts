'use server'

import { and, asc, eq, gte, isNull, lte, ne, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { areIntervalsOverlapping, getUnixTime } from 'date-fns'
import { Sleep } from '../types/sleep'
import { db } from '@/db'
import { NewSleep, sleep } from '@/db/schema'
import {
  getAuthUserIdWithServerAction,
  getAuthUserIdWithServerComponent,
} from '@/utils/getAuthUserId'
import { Result } from '@/types/global'
import { getLastInsertId } from '@/utils/getLastInsertId'
import { uuidToBin } from '@/utils/uuid'

const getSleepAndSegmentedSleeps = (sleeps: { start: Date; end: Date }[]) => {
  const sortedSleeps = [...sleeps].sort(
    (a, b) => getUnixTime(a.start) - getUnixTime(b.start)
  )
  const [firstSleep, ...segmentedSleeps] = sortedSleeps
  return { firstSleep, segmentedSleeps }
}

type OverlapError = {
  type: 'overlapWithRecorded' | 'overlapInRequest'
}
const checkOverlap = async (
  userId: string,
  sleeps: { start: Date; end: Date }[],
  originalSleepId?: number
): Promise<OverlapError | undefined> => {
  // 既存のSleepと重複していないかチェック
  const overlappingSleeps = await db.query.sleep.findMany({
    where: and(
      eq(sleep.userId, uuidToBin(userId)),
      originalSleepId ? ne(sleep.id, originalSleepId) : undefined,
      originalSleepId
        ? or(
            isNull(sleep.parentSleepId),
            ne(sleep.parentSleepId, originalSleepId)
          )
        : undefined,
      or(
        ...sleeps.flatMap((s) => [
          and(lte(sleep.start, s.start), gte(sleep.end, s.start)),
          and(lte(sleep.start, s.end), gte(sleep.end, s.end)),
          and(gte(sleep.start, s.start), lte(sleep.end, s.end)),
        ])
      )
    ),
  })

  if (overlappingSleeps.length > 0) {
    return { type: 'overlapWithRecorded' }
  }

  // リクエスト内で重複していないかチェック
  const hasOverlappingSleeps = (sleeps: { start: Date; end: Date }[]) => {
    return sleeps.some((current, i) => {
      return sleeps.slice(i + 1).some((compare) => {
        return areIntervalsOverlapping(current, compare)
      })
    })
  }
  if (hasOverlappingSleeps(sleeps)) {
    return { type: 'overlapInRequest' }
  }
}

export const addSleep = async (
  sleeps: { start: Date; end: Date }[]
): Promise<{ error?: OverlapError | true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const overlapError = await checkOverlap(userId, sleeps)
    if (overlapError) return { error: overlapError }

    const { firstSleep, segmentedSleeps } = getSleepAndSegmentedSleeps(sleeps)

    await db.transaction(async (tx) => {
      await tx.insert(sleep).values({
        userId: uuidToBin(userId),
        start: firstSleep.start,
        end: firstSleep.end,
      })

      if (segmentedSleeps.length) {
        const insertId = await getLastInsertId(tx)
        await tx.insert(sleep).values(
          segmentedSleeps.map(
            (s) =>
              ({
                userId: uuidToBin(userId) as unknown as string,
                start: s.start,
                end: s.end,
                parentSleepId: insertId,
              } satisfies NewSleep)
          )
        )
      }
    })

    revalidatePath('/home')
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const updateSleep = async (
  id: number,
  sleeps: { start: Date; end: Date }[]
): Promise<{ error?: OverlapError | true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const originalSleep = await db.query.sleep.findFirst({
      where: and(eq(sleep.userId, uuidToBin(userId)), eq(sleep.id, id)),
    })
    if (!originalSleep) throw new Error('sleep not found')

    const overlapError = await checkOverlap(userId, sleeps, id)
    if (overlapError) return { error: overlapError }

    const { firstSleep, segmentedSleeps } = getSleepAndSegmentedSleeps(sleeps)

    await db.transaction(async (tx) => {
      await tx
        .update(sleep)
        .set({
          userId: uuidToBin(userId),
          start: firstSleep.start,
          end: firstSleep.end,
        })
        .where(eq(sleep.id, id))

      if (segmentedSleeps.length) {
        await tx.delete(sleep).where(eq(sleep.parentSleepId, id))

        await tx.insert(sleep).values(
          segmentedSleeps.map(
            (s) =>
              ({
                userId: uuidToBin(userId) as unknown as string,
                start: s.start,
                end: s.end,
                parentSleepId: id,
              } satisfies NewSleep)
          )
        )
      }
    })

    revalidatePath('/home')
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const deleteSleep = async (id: number): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await db
      .delete(sleep)
      .where(
        and(
          eq(sleep.userId, uuidToBin(userId)),
          or(eq(sleep.id, id), eq(sleep.parentSleepId, id))
        )
      )

    revalidatePath('/home')
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const getSleeps = async ({
  start,
  end,
}: {
  start: Date
  end: Date
}): Promise<Result<{ sleeps: Sleep[] }, true>> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const sleeps = await db.query.sleep.findMany({
      where: and(
        eq(sleep.userId, uuidToBin(userId)),
        gte(sleep.start, start),
        lte(sleep.end, end),
        isNull(sleep.parentSleepId)
      ),
      orderBy: [asc(sleep.start)],
      with: {
        segmentedSleeps: {
          orderBy: [asc(sleep.start)],
        },
      },
    })
    return {
      sleeps: sleeps.map((sleep) => ({
        id: sleep.id,
        sleeps: [
          {
            start: sleep.start,
            end: sleep.end,
          },
          ...sleep.segmentedSleeps.map((s) => ({
            start: s.start,
            end: s.end,
          })),
        ],
      })),
    }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

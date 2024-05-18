'use server'

import {
  addHours,
  areIntervalsOverlapping,
  getUnixTime,
  subHours,
} from 'date-fns'
import { revalidatePath } from 'next/cache'
import { PrismaClient } from '@prisma/client'
import { Sleep } from '../types/sleep'
import { createPrisma } from '@/libs/cachedPrisma'
import { log } from '@/libs/axiomLogger'
import {
  getAuthUserIdWithServerAction,
  getAuthUserIdWithServerComponent,
} from '@/utils/getAuthUserId'
import { Result } from '@/types/global'

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
  prisma: PrismaClient,
  userId: string,
  sleeps: { start: Date; end: Date }[],
  originalSleepId?: number
): Promise<OverlapError | undefined> => {
  // 既存のSleepと重複していないかチェック
  const overlappingSleeps = await prisma.sleep.findMany({
    where: {
      userId,
      id: { not: originalSleepId },
      AND: [
        {
          OR: [
            { parentSleepId: originalSleepId ? null : undefined },
            { parentSleepId: { not: originalSleepId } },
          ],
        },
        {
          OR: [
            ...sleeps.flatMap((s) => [
              { start: { lte: s.start }, end: { gte: s.start } },
              { start: { lte: s.end }, end: { gte: s.end } },
              { start: { gte: s.start }, end: { lte: s.end } },
            ]),
          ],
        },
      ],
    },
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

type ShortIntervalError = { type: 'shortInterval' }
const checkShortInterval = async (
  prisma: PrismaClient,
  userId: string,
  sleeps: { start: Date; end: Date }[],
  originalSleepId?: number
): Promise<ShortIntervalError | undefined> => {
  const sortedSleeps = [...sleeps].sort(
    (a, b) => getUnixTime(a.start) - getUnixTime(b.start)
  )

  // 既存の睡眠とリクエストの睡眠との間隔が8時間以上あるかチェック
  const INTERVAL = 8
  const shortIntervalSleeps = await prisma.sleep.findMany({
    where: {
      userId,
      id: { not: originalSleepId },
      AND: [
        {
          OR: [
            { parentSleepId: originalSleepId ? null : undefined },
            { parentSleepId: { not: originalSleepId } },
          ],
        },
        {
          OR: [
            {
              end: {
                gte: subHours(sortedSleeps[0].start, INTERVAL),
                lte: sortedSleeps[0].start,
              },
            },
            {
              start: {
                gte: sortedSleeps[sortedSleeps.length - 1].end,
                lte: addHours(
                  sortedSleeps[sortedSleeps.length - 1].end,
                  INTERVAL
                ),
              },
            },
          ],
        },
      ],
    },
  })

  if (shortIntervalSleeps.length > 0) {
    return { type: 'shortInterval' }
  }
}

export const addSleep = async ({
  sleeps,
  ignoreShortInterval,
}: {
  sleeps: { start: Date; end: Date }[]
  ignoreShortInterval?: boolean
}): Promise<{ error?: OverlapError | ShortIntervalError | true }> => {
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const overlapError = await checkOverlap(prisma, userId, sleeps)
    if (overlapError) return { error: overlapError }

    const shortIntervalError = await checkShortInterval(prisma, userId, sleeps)
    if (shortIntervalError && !ignoreShortInterval) {
      return { error: shortIntervalError }
    }

    const { firstSleep, segmentedSleeps } = getSleepAndSegmentedSleeps(sleeps)

    await prisma.sleep.create({
      data: {
        userId,
        start: firstSleep.start,
        end: firstSleep.end,
        segmentedSleeps: {
          create: segmentedSleeps.map((s) => ({
            userId,
            start: s.start,
            end: s.end,
          })),
        },
      },
    })

    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const updateSleep = async ({
  id,
  sleeps,
  ignoreShortInterval,
}: {
  id: number
  sleeps: { start: Date; end: Date }[]
  ignoreShortInterval?: boolean
}): Promise<{ error?: OverlapError | ShortIntervalError | true }> => {
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const originalSleep = await prisma.sleep.findFirst({
      where: { userId, id },
    })
    if (!originalSleep) throw new Error('sleep not found')

    const overlapError = await checkOverlap(prisma, userId, sleeps, id)
    if (overlapError) return { error: overlapError }

    const shortIntervalError = await checkShortInterval(
      prisma,
      userId,
      sleeps,
      id
    )
    if (shortIntervalError && !ignoreShortInterval) {
      return { error: shortIntervalError }
    }

    const { firstSleep, segmentedSleeps } = getSleepAndSegmentedSleeps(sleeps)

    await prisma.sleep.update({
      where: { id },
      data: {
        start: firstSleep.start,
        end: firstSleep.end,
        segmentedSleeps: {
          deleteMany: { parentSleepId: id },
          create: segmentedSleeps.map((s) => ({
            userId,
            start: s.start,
            end: s.end,
          })),
        },
      },
    })

    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const deleteSleep = async (id: number): Promise<{ error?: true }> => {
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await prisma.sleep.delete({ where: { userId, id } })

    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
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
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const sleeps = await prisma.sleep.findMany({
      where: {
        userId,
        start: { gte: start },
        end: { lte: end },
        parentSleep: null,
      },
      orderBy: { start: 'asc' },
      include: {
        segmentedSleeps: { orderBy: { start: 'asc' } },
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
    log.error(e)
    return { error: true }
  }
}

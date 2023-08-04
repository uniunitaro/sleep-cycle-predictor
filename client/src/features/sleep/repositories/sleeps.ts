'use server'

import { and, eq, gte, lte } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { Sleep } from '../types/sleep'
import { db } from '@/db'
import { sleep } from '@/db/schema'
import {
  getAuthUserIdWithServerAction,
  getAuthUserIdWithServerComponent,
} from '@/utils/getAuthUserId'
import { Result } from '@/types/global'

export const addSleep = async (
  sleeps: { start: Date; end: Date }[]
): Promise<{ error?: boolean }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await db.insert(sleep).values({
      userId,
      start: sleeps[0].start,
      end: sleeps[0].end,
    })

    revalidatePath('/home')
    return {}
  } catch (e) {
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
        eq(sleep.userId, userId),
        gte(sleep.start, start),
        lte(sleep.end, end)
      ),
    })
    return {
      sleeps: sleeps.map((sleep) => ({
        id: sleep.id,
        sleeps: [
          {
            start: sleep.start,
            end: sleep.end,
          },
        ],
      })),
    }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

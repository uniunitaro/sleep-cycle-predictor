'use server'

import { and, asc, eq, gte } from 'drizzle-orm'
import { Prediction } from '../types/sleep'
import { getSrcStart } from '../utils/getSrcStart'
import { predictWithLR } from '../utils/predictWithLR'
import { getAuthUserIdWithServerComponent } from '@/utils/getAuthUserId'
import { db } from '@/db'
import { config, segmentedSleep, sleep } from '@/db/schema'

export const getPredictions = async ({
  start,
  end,
}: {
  start: Date
  end: Date
}): Promise<
  | { predictions: Prediction[]; error?: undefined }
  | { predictions?: undefined; error: true }
> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const userConfig = await db.query.config.findFirst({
      where: eq(config.userId, userId),
    })
    if (!userConfig) throw new Error('config not found')

    const srcStart = getSrcStart(userConfig.predictionSrcDuration)
    const sleeps = await db.query.sleep.findMany({
      where: and(eq(sleep.userId, userId), gte(sleep.start, srcStart)),
      orderBy: [asc(sleep.start)],
      with: {
        segmentedSleeps: {
          orderBy: [asc(segmentedSleep.start)],
        },
      },
    })

    const predictions = predictWithLR(sleeps, start, end)
    return { predictions }
  } catch (e) {
    return { error: true }
  }
}

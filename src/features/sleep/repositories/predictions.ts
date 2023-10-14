'use server'

import { and, asc, eq, gte, isNull } from 'drizzle-orm'
import { Logger, log } from 'next-axiom'
import { Prediction } from '../types/sleep'
import { getSrcStart } from '../utils/getSrcStart'
import { predictWithLR } from '../utils/predictWithLR/predictWithLR'
import { getAuthUserIdWithServerComponent } from '@/utils/getAuthUserId'
import { db } from '@/db'
import { config, sleep } from '@/db/schema'
import { Result } from '@/types/global'
import { uuidToBin } from '@/utils/uuid'
import { logger } from '@/libs/axiomLogger'

export const getPredictions = async ({
  userId,
  start,
  end,
}: {
  userId: string
  start: Date
  end: Date
}): Promise<Result<{ predictions: Prediction[] }, true>> => {
  try {
    const userConfig = await db.query.config.findFirst({
      where: eq(config.userId, uuidToBin(userId)),
    })
    if (!userConfig) throw new Error('config not found')

    const srcStart = getSrcStart(userConfig.predictionSrcDuration)
    const sleeps = await db.query.sleep.findMany({
      where: and(
        eq(sleep.userId, uuidToBin(userId)),
        gte(sleep.start, srcStart),
        isNull(sleep.parentSleepId)
      ),
      orderBy: [asc(sleep.start)],
      with: {
        segmentedSleeps: {
          orderBy: [asc(sleep.start)],
        },
      },
    })

    const predictions = predictWithLR(sleeps, start, end)
    return { predictions }
  } catch (e) {
    const log = new Logger()
    log.error('this is test')
    await log.flush()
    return { error: true }
  }
}

export const getMyPredictions = async ({
  start,
  end,
}: {
  start: Date
  end: Date
}): Promise<Result<{ predictions: Prediction[] }, true>> => {
  const { userId, error } = await getAuthUserIdWithServerComponent()
  if (error) {
    logger.error(error)
    return { error: true }
  }

  return getPredictions({ userId, start, end })
}

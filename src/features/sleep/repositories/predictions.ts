'use server'

import { Prediction } from '../types/sleep'
import { getSrcStart } from '../utils/getSrcStart'
import { predictWithLR } from '../utils/predictWithLR/predictWithLR'
import { getAuthUserIdWithServerComponent } from '@/utils/getAuthUserId'
import { Result } from '@/types/global'
import { log } from '@/libs/axiomLogger'
import { createPrisma } from '@/libs/cachedPrisma'

export const getPredictions = async ({
  userId,
  start,
  end,
}: {
  userId: string
  start: Date
  end: Date
}): Promise<Result<{ predictions: Prediction[] }, true>> => {
  const prisma = createPrisma()
  try {
    const userConfig = await prisma.config.findFirst({
      where: { userId },
    })
    if (!userConfig) throw new Error('config not found')

    const srcStart = getSrcStart(userConfig)

    const sleeps = await prisma.sleep.findMany({
      where: {
        userId,
        start: { gte: srcStart },
        parentSleep: null,
      },
      orderBy: { start: 'asc' },
      include: {
        segmentedSleeps: { orderBy: { start: 'asc' } },
      },
    })

    const predictions = predictWithLR(sleeps, start, end)
    return { predictions }
  } catch (e) {
    log.error(e)
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
    log.error(error)
    return { error: true }
  }

  return getPredictions({ userId, start, end })
}

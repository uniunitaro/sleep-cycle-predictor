import { interquartileRange, mean, median } from 'simple-statistics'
import { Sleep } from '@prisma/client'

export type CombinedSleep = {
  sleep: Sleep
  duration: number
  sleepMidUnixTime: number
}

export const getOutlierSleeps = (
  sleeps: CombinedSleep[]
): { id: number; interpolationDays: number }[] => {
  if (sleeps.length <= 1) {
    return []
  }

  // (当日の中間睡眠時刻 - 前日の中間睡眠時刻)
  const sleepMidUnixTimeDiffs = sleeps.flatMap(
    ({ sleep, sleepMidUnixTime }, i) =>
      i === 0
        ? []
        : [
            {
              ...sleep,
              diffInSecond: sleepMidUnixTime - sleeps[i - 1].sleepMidUnixTime,
            },
          ]
  )

  const diffMedian = median(
    sleepMidUnixTimeDiffs.map(({ diffInSecond: diffInSecond }) => diffInSecond)
  )
  const diffIqr = interquartileRange(
    sleepMidUnixTimeDiffs.map(({ diffInSecond: diffInSecond }) => diffInSecond)
  )

  const calculateInterpolationDays = (diffInSecond: number) => {
    const meanDiff = mean(
      sleepMidUnixTimeDiffs.map(
        ({ diffInSecond: diffInSecond }) => diffInSecond
      )
    )

    // 補完する日数だから-1
    const days = Math.round(diffInSecond / meanDiff) - 1
    if (days < 0) {
      return 0
    }
    return days
  }

  const OUTLIER_THRESHOLD = 8
  const outlierSleeps = sleepMidUnixTimeDiffs.flatMap(
    ({ id, diffInSecond: diffInSecond }) => {
      // ロバストzスコア
      const zScore = (diffInSecond - diffMedian) / (diffIqr * 0.7413)
      return Math.abs(zScore) > OUTLIER_THRESHOLD
        ? [{ id, interpolationDays: calculateInterpolationDays(diffInSecond) }]
        : []
    }
  )

  return outlierSleeps
}

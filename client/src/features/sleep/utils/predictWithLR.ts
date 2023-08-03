import { fromUnixTime, getUnixTime, isAfter, isBefore, max } from 'date-fns'
import {
  interquartileRange,
  linearRegression,
  linearRegressionLine,
  mean,
  median,
} from 'simple-statistics'
import { SegmentedSleep, Sleep } from '@/db/schema'

type CombinedSleep = {
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

export const predictWithLR = (
  sleeps: (Sleep & { segmentedSleeps: SegmentedSleep[] })[],
  startDate: Date,
  endDate: Date
) => {
  if (sleeps.length <= 1) {
    return []
  }

  const combinedSleeps: CombinedSleep[] = sleeps.flatMap((sleep) => {
    if (sleep.segmentedSleeps.length) {
      // 睡眠開始時刻の昇順でソートされているので最後の要素が最も遅い睡眠
      const lastSegmentedSleep =
        sleep.segmentedSleeps[sleep.segmentedSleeps.length - 1]
      return [
        {
          sleep: { ...sleep, start: sleep.start, end: lastSegmentedSleep.end },
          duration:
            getUnixTime(lastSegmentedSleep.end) - getUnixTime(sleep.start),
          sleepMidUnixTime:
            getUnixTime(sleep.start) +
            (getUnixTime(lastSegmentedSleep.end) - getUnixTime(sleep.start)) /
              2,
        },
      ]
    } else {
      return [
        {
          sleep,
          duration: getUnixTime(sleep.end) - getUnixTime(sleep.start),
          sleepMidUnixTime:
            getUnixTime(sleep.start) +
            (getUnixTime(sleep.end) - getUnixTime(sleep.start)) / 2,
        },
      ]
    }
  })

  const outlierSleeps = getOutlierSleeps(combinedSleeps)
  const combinedSleepsWithX: (CombinedSleep & { x: number })[] =
    combinedSleeps.map((combinedSleep, index) => {
      const outlierCount = outlierSleeps
        .filter(({ id }) =>
          combinedSleeps
            .slice(0, index + 1)
            .map(({ sleep }) => sleep.id)
            .includes(id)
        )
        .reduce((count, sleep) => count + sleep.interpolationDays, 0)

      return {
        ...combinedSleep,
        x: index + outlierCount,
      }
    })

  const arrayData = combinedSleepsWithX.map(({ x, sleepMidUnixTime }) => {
    return [x, sleepMidUnixTime]
  })

  const mb = linearRegression(arrayData)
  const line = linearRegressionLine(mb)

  const meanSleepDuration = mean(combinedSleeps.map(({ duration }) => duration))

  const getPrediction = (
    startDate: Date,
    endDate: Date,
    index = 1,
    result: { start: Date; end: Date }[] = []
  ): { start: Date; end: Date }[] => {
    const x = index + combinedSleepsWithX[combinedSleepsWithX.length - 1].x
    const y = line(x)

    const sleepStart = fromUnixTime(y - meanSleepDuration / 2)
    const sleepEnd = fromUnixTime(y + meanSleepDuration / 2)

    if (isAfter(sleepEnd, endDate)) {
      return result
    }

    const lastRealSleep = combinedSleeps[combinedSleeps.length - 1]
    if (isAfter(sleepStart, max([lastRealSleep.sleep.end, startDate]))) {
      result.push({ start: sleepStart, end: sleepEnd })
    }

    return getPrediction(startDate, endDate, index + 1, result)
  }

  const result = getPrediction(startDate, endDate)

  return result
}

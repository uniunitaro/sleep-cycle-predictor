import { fromUnixTime, getUnixTime, isAfter } from 'date-fns'
import { linearRegression, linearRegressionLine, mean } from 'simple-statistics'
import { CombinedSleep, getOutlierSleeps } from './getOutlierSleeps'
import { Sleep } from '@/db/schema'

export const predictWithLR = (
  sleeps: (Sleep & { segmentedSleeps: Sleep[] })[],
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
      const totalDuration = [sleep, ...sleep.segmentedSleeps].reduce(
        (total, segmentedSleep) =>
          total +
          (getUnixTime(segmentedSleep.end) - getUnixTime(segmentedSleep.start)),
        0
      )
      return [
        {
          sleep: { ...sleep, start: sleep.start, end: lastSegmentedSleep.end },
          duration: totalDuration,
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
    if (
      isAfter(sleepStart, lastRealSleep.sleep.end) &&
      isAfter(sleepEnd, startDate)
    ) {
      result.push({ start: sleepStart, end: sleepEnd })
    }

    return getPrediction(startDate, endDate, index + 1, result)
  }

  const result = getPrediction(startDate, endDate)

  return result
}

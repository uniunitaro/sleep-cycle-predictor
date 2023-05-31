import { Sleep } from '@prisma/client'
import { fromUnixTime, getUnixTime, isAfter, differenceInHours } from 'date-fns'
import { linearRegression, linearRegressionLine, mean } from 'simple-statistics'

export const predictWithLR = (
  sleeps: Sleep[],
  startDate: Date,
  endDate: Date,
) => {
  const SLEEP_INTERVAL_HOURS = 8

  // 分割睡眠があった場合一つの睡眠として扱う
  const isSegmentedSleep = (currSleep?: Sleep, prevSleep?: Sleep) =>
    !!currSleep &&
    !!prevSleep &&
    differenceInHours(currSleep.start, prevSleep.end) < SLEEP_INTERVAL_HOURS
  const combinedSleeps: { sleep: Sleep; duration: number }[] = sleeps.flatMap(
    (sleep, i) => {
      if (isSegmentedSleep(sleeps[i + 1], sleep)) {
        return [
          {
            sleep: { ...sleep, start: sleep.start, end: sleeps[i + 1].end },
            duration:
              getUnixTime(sleep.end) -
              getUnixTime(sleep.start) +
              getUnixTime(sleeps[i + 1].end) -
              getUnixTime(sleeps[i + 1].start),
          },
        ]
      } else if (isSegmentedSleep(sleep, sleeps[i - 1])) {
        return []
      }
      return [
        {
          sleep,
          duration: getUnixTime(sleep.end) - getUnixTime(sleep.start),
        },
      ]
    },
  )

  const arrayData = combinedSleeps.map(({ sleep }, i) => {
    const median =
      getUnixTime(sleep.start) +
      (getUnixTime(sleep.end) - getUnixTime(sleep.start)) / 2
    return [i, median]
  })

  const mb = linearRegression(arrayData)
  const line = linearRegressionLine(mb)

  const meanSleepDuration = mean(combinedSleeps.map(({ duration }) => duration))

  const getPrediction = (
    startDate: Date,
    endDate: Date,
    index = 0,
    result: { start: Date; end: Date }[] = [],
  ): { start: Date; end: Date }[] => {
    const x = index + combinedSleeps.length
    const y = line(x)

    const sleepStart = fromUnixTime(y - meanSleepDuration / 2)
    const sleepEnd = fromUnixTime(y + meanSleepDuration / 2)

    if (isAfter(sleepEnd, endDate)) {
      return result
    }

    if (isAfter(sleepStart, startDate)) {
      result.push({ start: sleepStart, end: sleepEnd })
    }

    return getPrediction(startDate, endDate, index + 1, result)
  }

  const result = getPrediction(startDate, endDate)

  return result
}

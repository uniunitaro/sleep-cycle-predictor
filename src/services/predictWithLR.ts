import { Sleep } from '@prisma/client'
import { fromUnixTime, getUnixTime, isAfter } from 'date-fns'
import { linearRegression, linearRegressionLine, mean } from 'simple-statistics'

export const predictWithLR = (
  sleeps: Sleep[],
  startDate: Date,
  endDate: Date
) => {
  const arrayData = sleeps.map((sleep, i) => {
    const median =
      getUnixTime(sleep.start) +
      (getUnixTime(sleep.end) - getUnixTime(sleep.start)) / 2
    return [i, median]
  })

  const mb = linearRegression(arrayData)
  const line = linearRegressionLine(mb)

  const meanSleepDuration = mean(
    sleeps.map(
      (sleep) =>
        getUnixTime(new Date(sleep.end)) - getUnixTime(new Date(sleep.start))
    )
  )

  const getPrediction = (
    startDate: Date,
    endDate: Date,
    index = 0,
    result: { start: Date; end: Date }[] = []
  ): { start: Date; end: Date }[] => {
    const x = index + sleeps.length
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

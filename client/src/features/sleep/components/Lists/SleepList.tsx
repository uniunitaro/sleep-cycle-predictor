import { FC } from 'react'
import { getMonth } from 'date-fns'
import SleepOverview from './SleepOverview'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { Stack } from '@/components/chakra'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
}
const SleepList: FC<Props> = ({ sleeps, predictions, targetDate }) => {
  const currentMonthSleeps = sleeps.filter(
    (sleep) => getMonth(sleep.sleeps[0].start) === getMonth(targetDate)
  )
  const currentMonthPredictions = predictions.filter(
    (prediction) => getMonth(prediction.start) === getMonth(targetDate)
  )

  return (
    <Stack gap="3">
      {currentMonthSleeps.map((sleep) => (
        <SleepOverview sleep={sleep} key={sleep.id} variant="small" />
      ))}
      {currentMonthPredictions.map((prediction) => (
        <SleepOverview
          prediction={prediction}
          key={prediction.start.getTime()}
        />
      ))}
    </Stack>
  )
}

export default SleepList

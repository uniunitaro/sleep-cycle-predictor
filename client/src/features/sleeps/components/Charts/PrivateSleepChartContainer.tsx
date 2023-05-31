import { FC, useState } from 'react'
import { endOfMonth, isAfter, startOfDay, startOfMonth } from 'date-fns'
import { useSleeps } from '../../apis/useSleeps'
import { useMyPredictions } from '../../apis/usePredictions'
import SleepChart from './SleepChart'

const PrivateSleepChartContainer: FC = () => {
  const [targetDate, setTargetDate] = useState(startOfMonth(new Date()))
  const startDate = targetDate
  const endDate = endOfMonth(targetDate)
  const { data: sleeps, isLoading: isSleepsLoading } = useSleeps({
    start: startDate,
    end: endDate,
  })

  const today = startOfDay(new Date())
  const predictionsStart = isAfter(startDate, today) ? startDate : today
  const { data: predictions, isLoading: isPredictionsLoading } =
    useMyPredictions({
      start: predictionsStart,
      end: endDate,
    })

  return (
    <SleepChart
      sleeps={sleeps ?? []}
      predictions={predictions ?? []}
      isLoading={isSleepsLoading || isPredictionsLoading}
      targetDate={targetDate}
      setTargetDate={setTargetDate}
    />
  )
}

export default PrivateSleepChartContainer

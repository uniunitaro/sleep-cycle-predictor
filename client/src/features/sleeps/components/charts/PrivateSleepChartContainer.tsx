import { FC, useState } from 'react'
import { endOfMonth, startOfMonth } from 'date-fns'
import { useSleeps } from '../../apis/useSleeps'
import { useMyPredictions } from '../../apis/usePredictions'
import SleepChart from './SleepChart/SleepChart'

const PrivateSleepChartContainer: FC = () => {
  const [targetDate, setTargetDate] = useState(startOfMonth(new Date()))
  const startDate = targetDate
  const endDate = endOfMonth(targetDate)
  const { data: sleeps, isLoading: isSleepsLoading } = useSleeps({
    start: startDate,
    end: endDate,
  })

  const { data: predictions, isLoading: isPredictionsLoading } =
    useMyPredictions({
      start: startDate,
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

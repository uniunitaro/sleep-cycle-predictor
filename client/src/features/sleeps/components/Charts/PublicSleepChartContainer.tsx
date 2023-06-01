import { FC, useState } from 'react'
import { endOfMonth, startOfMonth } from 'date-fns'
import { usePredictions } from '../../apis/usePredictions'
import SleepChart from './SleepChart'

const PrivateSleepChartContainer: FC<{ userId: string }> = ({ userId }) => {
  const [targetDate, setTargetDate] = useState(startOfMonth(new Date()))
  const startDate = targetDate
  const endDate = endOfMonth(targetDate)

  const { data: predictions, isLoading: isPredictionsLoading } = usePredictions(
    userId,
    {
      start: startDate,
      end: endDate,
    }
  )

  return (
    <SleepChart
      sleeps={[]}
      predictions={predictions ?? []}
      isLoading={isPredictionsLoading}
      targetDate={targetDate}
      setTargetDate={setTargetDate}
    />
  )
}

export default PrivateSleepChartContainer

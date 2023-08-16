import { FC } from 'react'
import { Prediction } from '../../types/sleep'
import SleepChart from './SleepChart/SleepChart'

const PublicSleepChartContainer: FC<{
  userId: string
  predictions: Prediction[]
  targetDate: Date
}> = ({ predictions, targetDate }) => {
  return (
    <SleepChart sleeps={[]} predictions={predictions} targetDate={targetDate} />
  )
}

export default PublicSleepChartContainer

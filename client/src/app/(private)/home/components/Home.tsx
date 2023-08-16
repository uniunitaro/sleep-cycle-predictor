import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
const Home: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
}> = ({ sleeps, predictions, targetDate }) => {
  const PrivateSleepChartContainer = dynamic(
    () =>
      import('@/features/sleep/components/charts/PrivateSleepChartContainer'),
    { ssr: false }
  )

  return (
    sleeps &&
    predictions && (
      <PrivateSleepChartContainer
        sleeps={sleeps}
        predictions={predictions}
        targetDate={targetDate}
      />
    )
  )
}

export default Home

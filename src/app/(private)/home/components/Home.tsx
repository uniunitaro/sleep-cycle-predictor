import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { DisplayMode } from '@/features/sleep/types/chart'
const Home: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}> = ({ sleeps, predictions, targetDate, displayMode }) => {
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
        displayMode={displayMode}
      />
    )
  )
}

export default Home

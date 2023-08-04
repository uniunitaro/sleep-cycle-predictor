import { FC } from 'react'
import dynamic from 'next/dynamic'
import { getSleeps } from '@/features/sleep/repositories/sleeps'
import { getPredictions } from '@/features/sleep/repositories/predictions'
const Home: FC = async () => {
  // TODO エラー処理
  const { sleeps, error } = await getSleeps({
    start: new Date(2023, 6, 31),
    end: new Date(2023, 7, 31),
  })

  const { predictions, error: predictionsError } = await getPredictions({
    start: new Date(2023, 6, 31),
    end: new Date(2023, 7, 31),
  })

  const PrivateSleepChartContainer = dynamic(
    () =>
      import('@/features/sleep/components/charts/PrivateSleepChartContainer'),
    { ssr: false }
  )

  return (
    sleeps &&
    predictions && (
      <PrivateSleepChartContainer sleeps={sleeps} predictions={predictions} />
    )
  )
}

export default Home

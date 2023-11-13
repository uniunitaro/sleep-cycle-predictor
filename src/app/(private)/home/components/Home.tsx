import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { DisplayMode } from '@/features/sleep/types/chart'
import ChartPageHeader from '@/components/ChartPageHeader'
import { Box, Flex } from '@/components/chakra'
import { Calendar } from '@/db/schema'
const Home: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  hasTargetDate: boolean
  displayMode: DisplayMode
  calendars: Calendar[]
}> = ({
  sleeps,
  predictions,
  targetDate,
  hasTargetDate,
  displayMode,
  calendars,
}) => {
  const SleepChartContainer = dynamic(
    () => import('@/features/sleep/components/charts/SleepChartContainer'),
    { ssr: false }
  )

  return (
    sleeps &&
    predictions && (
      <Flex direction="column" h="100%">
        <ChartPageHeader displayMode={displayMode} />
        <Box flex="1" minH="0">
          <SleepChartContainer
            sleeps={sleeps}
            predictions={predictions}
            targetDate={targetDate}
            hasTargetDate={hasTargetDate}
            displayMode={displayMode}
            calendars={calendars}
            isPublic={false}
          />
        </Box>
      </Flex>
    )
  )
}

export default Home

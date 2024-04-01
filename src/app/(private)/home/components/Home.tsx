import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Box, Flex } from '@chakra-ui/react'
import { Calendar } from '@prisma/client'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { DisplayMode } from '@/features/sleep/types/chart'
import ChartPageHeader from '@/components/ChartPageHeader'

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
          <Suspense>
            <SleepChartContainer
              sleeps={sleeps}
              predictions={predictions}
              targetDate={targetDate}
              hasTargetDate={hasTargetDate}
              displayMode={displayMode}
              calendars={calendars}
              isPublic={false}
            />
          </Suspense>
        </Box>
      </Flex>
    )
  )
}

export default Home

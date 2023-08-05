'use client'

import { FC, useRef, useState } from 'react'
import {
  addDays,
  differenceInMilliseconds,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
} from 'date-fns'
import { usePathname } from 'next/navigation'
import ChartColumn from '../ChartColumn'
import SleepBar from '../SleepBar'
import ChartHeader from '../ChartHeader'
import {
  Box,
  Center,
  Flex,
  HStack,
  Stack,
  StackDivider,
  VStack,
  useDimensions,
} from '@/components/chakra'
import AwesomeLoader from '@/components/AwesomeLoader/AwesomeLoader'
import CardMdOnly from '@/components/CardMdOnly/CardMdOnly'
import CardBodyMdOnly from '@/components/CardBodyMdOnly'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  isLoading: boolean
  targetDate: Date
}
const SleepChart: FC<Props> = ({
  sleeps,
  predictions,
  isLoading,
  targetDate,
}) => {
  const [displayMode, setDisplayMode] = useState<'month' | 'week'>('month')
  const startDate = targetDate
  const endDate =
    displayMode === 'month' ? endOfMonth(targetDate) : endOfWeek(targetDate)

  const headerHeight = 48

  const dailySleeps = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) => {
      const formattedPredictions = predictions?.map((p, i) => ({
        ...p,
        // sleepのidと重複しないように負の値にしている
        id: -i,
        isPrediction: true,
      }))

      const formattedSleeps = sleeps?.flatMap((sleep) =>
        sleep.sleeps.map((s) => ({
          ...s,
          id: sleep.id,
        }))
      )

      const dailySleeps = [
        ...(formattedSleeps ?? []),
        ...(formattedPredictions ?? []),
      ]
        ?.filter((s) => isSameDay(s.start, date) || isSameDay(s.end, date))
        .map((sleep) => {
          const start = isSameDay(sleep.start, date) ? sleep.start : date
          const end = isSameDay(sleep.end, date) ? sleep.end : addDays(date, 1)
          const barHeightPercentage =
            (differenceInMilliseconds(end, start) / 24 / 60 / 60 / 1000) * 100
          const barTopPercentage =
            (differenceInMilliseconds(start, date) / 24 / 60 / 60 / 1000) * 100

          return {
            ...sleep,
            start,
            end,
            barHeightPercentage,
            barTopPercentage,
            isPrediction: 'isPrediction' in sleep ? sleep.isPrediction : false,
          }
        })
      return {
        date,
        sleeps: dailySleeps,
      }
    }
  )

  const [hoveredSleepId, setHoveredSleepId] = useState<number>()

  const chartRef = useRef<HTMLDivElement>(null)
  const chartDimensions = useDimensions(chartRef, true)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartContainerDimensions = useDimensions(chartContainerRef, true)

  const scrollBarHeight =
    (chartContainerDimensions?.contentBox.height ?? 0) -
    (chartDimensions?.contentBox.height ?? 0)

  return (
    <CardMdOnly h="100%">
      <CardBodyMdOnly h="100%" py={{ base: 2, md: 5 }}>
        <Stack h="100%">
          <ChartHeader targetDate={targetDate} />
          <Flex flex="1" overflowY="auto">
            <Flex position="relative" flex="1" minH="400px" overflowX="auto">
              {isLoading && (
                <Center
                  position="absolute"
                  w="100%"
                  h="100%"
                  backdropFilter="blur(2px)"
                  zIndex="5"
                >
                  <AwesomeLoader />
                </Center>
              )}
              <VStack mr="3" fontSize="xs" spacing="0" pl={{ base: 4, md: 0 }}>
                <Box
                  h={`calc(${headerHeight}px - ((100% - ${
                    headerHeight + scrollBarHeight
                  }px) / 24) / 2)`}
                />
                {[...Array(24)].map((_, i) => (
                  <Center
                    key={i}
                    h={`calc((100% - ${
                      headerHeight + scrollBarHeight
                    }px) / 24)`}
                    color="secondaryGray"
                  >
                    {i}:00
                  </Center>
                ))}
              </VStack>
              <Flex flex="1" overflowX="scroll" ref={chartContainerRef}>
                <Flex position="relative" flex="1" ref={chartRef}>
                  <Box>
                    <Box h={`${headerHeight}px`} />
                    {[...Array(24)].map((_, i) => (
                      <Box key={i} h={`calc((100% - ${headerHeight}px) / 24)`}>
                        <Box
                          position="absolute"
                          w="100%"
                          borderBottom="1px solid"
                          borderColor="chakra-border-color"
                        />
                      </Box>
                    ))}
                  </Box>
                  <HStack
                    divider={<StackDivider />}
                    spacing="0"
                    align="start"
                    flex="1"
                  >
                    {dailySleeps.map(({ date, sleeps }) => (
                      <ChartColumn
                        key={date.toString()}
                        date={date}
                        w={`${100 / dailySleeps.length}%`}
                        h="100%"
                        px="1"
                      >
                        <Box position="relative" height="100%" flex="1">
                          {sleeps &&
                            sleeps.map((sleep) => (
                              <SleepBar
                                key={date.toString() + sleep.id}
                                isHovered={hoveredSleepId === sleep.id}
                                position="absolute"
                                w="100%"
                                h={`${sleep.barHeightPercentage}%`}
                                top={`${sleep.barTopPercentage}%`}
                                barColor={sleep.isPrediction ? 'blue' : 'brand'}
                                onMouseEnter={() => setHoveredSleepId(sleep.id)}
                                onMouseLeave={() =>
                                  setHoveredSleepId(undefined)
                                }
                              />
                            ))}
                        </Box>
                      </ChartColumn>
                    ))}
                  </HStack>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </CardBodyMdOnly>
    </CardMdOnly>
  )
}

export default SleepChart

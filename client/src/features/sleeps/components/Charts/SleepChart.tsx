import {
  Box,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Stack,
  StackDivider,
  VStack,
  useDimensions,
} from '@chakra-ui/react'
import { FC, useRef, useState } from 'react'
import {
  addDays,
  addMonths,
  differenceInMilliseconds,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  startOfDay,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useSleeps } from '../../apis/useSleeps'
import { usePredictions } from '../../apis/usePredictions'
import SleepBar from './SleepBar'
import ChartColumn from './ChartColumn'
import AwesomeLoader from '@/components/AwesomeLoader'
import CardMdOnly from '@/components/CardMdOnly'
import CardBodyMdOnly from '@/components/CardBodyMdOnly'
const SleepChart: FC = () => {
  const [displayMode, setDisplayMode] = useState<'month' | 'week'>('month')
  const [targetDate, setTargetDate] = useState(startOfMonth(new Date()))
  const startDate = targetDate
  const endDate =
    displayMode === 'month' ? endOfMonth(targetDate) : endOfWeek(targetDate)

  const { data: sleeps, isLoading: isSleepsLoading } = useSleeps({
    start: startDate,
    end: endDate,
  })

  const today = startOfDay(new Date())
  const predictionsStart = isAfter(startDate, today) ? startDate : today
  const srcStart = subMonths(today, 1)
  const { data: predictions, isLoading: isPredictionsLoading } = usePredictions(
    {
      start: predictionsStart,
      end: endDate,
      srcStart,
    }
  )

  const headerHeight = 48

  const dailySleeps = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) => {
      const formattedPredictions = predictions?.map((p, i) => ({
        ...p,
        id: i,
        isPrediction: true,
      }))

      const dailySleeps = [...(sleeps ?? []), ...(formattedPredictions ?? [])]
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
  const chartHeightWoScrollBar = chartDimensions?.contentBox.height ?? 0

  return (
    <CardMdOnly h="100%">
      <CardBodyMdOnly h="100%" py={{ base: 2, md: 5 }}>
        <Stack h="100%">
          <HStack px={{ base: 4, md: 0 }}>
            <IconButton
              icon={<Icon as={FaChevronLeft} color="secondaryGray" />}
              aria-label="前の月を表示"
              size="sm"
              variant="ghost"
              onClick={() => setTargetDate(subMonths(targetDate, 1))}
            />
            <Heading size="md" fontWeight="normal">
              {format(startDate, 'yyyy年M月')}
            </Heading>
            <IconButton
              icon={<Icon as={FaChevronRight} color="secondaryGray" />}
              aria-label="次の月を表示"
              size="sm"
              variant="ghost"
              onClick={() => setTargetDate(addMonths(targetDate, 1))}
            />
          </HStack>
          <Flex flex="1" overflowY="auto">
            <Flex position="relative" flex="1" minH="400px" overflowX="auto">
              {(isSleepsLoading || isPredictionsLoading) && (
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
              <VStack
                mr="3"
                fontSize="xs"
                spacing="0"
                pl={{ base: 4, md: 0 }}
                height={`${chartHeightWoScrollBar}px`}
              >
                <Box
                  h={`calc(${headerHeight}px - ((100% - ${headerHeight}px) / 24) / 2)`}
                />
                {[...Array(24)].map((_, i) => (
                  <Center
                    key={i}
                    h={`calc((100% - ${headerHeight}px) / 24)`}
                    color="secondaryGray"
                  >
                    {i}:00
                  </Center>
                ))}
              </VStack>
              <Flex flex="1" overflowX="auto">
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

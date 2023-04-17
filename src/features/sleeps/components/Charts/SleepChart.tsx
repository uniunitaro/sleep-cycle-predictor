import {
  Box,
  Card,
  CardBody,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
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
import { useSleeps } from '../../apis/useSleeps'
import { usePredictions } from '../../apis/usePredictions'
import SleepBar from './SleepBar'
import ChartColumn from './ChartColumn'
import AwesomeLoader from '@/components/AwesomeLoader'

const SleepChart = () => {
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
  const cellHeight = 26

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

  return (
    <Card>
      <CardBody>
        <Stack>
          <HStack>
            <IconButton
              icon={<ArrowLeftIcon color="secondaryGray" />}
              aria-label="前の月を表示"
              size="sm"
              variant="ghost"
              onClick={() => setTargetDate(subMonths(targetDate, 1))}
            />
            <Heading size="md" fontWeight="normal">
              {format(startDate, 'yyyy年M月')}
            </Heading>
            <IconButton
              icon={<ArrowRightIcon color="secondaryGray" />}
              aria-label="次の月を表示"
              size="sm"
              variant="ghost"
              onClick={() => setTargetDate(addMonths(targetDate, 1))}
            />
          </HStack>
          <Flex position="relative">
            {(isSleepsLoading || isPredictionsLoading) && (
              <Center
                position="absolute"
                w="100%"
                h="100%"
                backdropFilter="blur(1px)"
                zIndex="5"
              >
                <AwesomeLoader />
              </Center>
            )}
            <VStack mr="3" fontSize="xs" spacing="0">
              <Box h={`${headerHeight - cellHeight / 2}px`} />
              {[...Array(24)].map((_, i) => (
                <Center key={i} h={`${cellHeight}px`} color="secondaryGray">
                  {i}:00
                </Center>
              ))}
            </VStack>
            <Flex flex="1" overflowY="auto">
              <Flex position="relative" flex="1">
                <Box>
                  <Box h={`${headerHeight}px`} />
                  {[...Array(24)].map((_, i) => (
                    <Box key={i} h={`${cellHeight}px`}>
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
                  spacing="1"
                  align="start"
                  flex="1"
                >
                  {dailySleeps.map(({ date, sleeps }) => (
                    <ChartColumn
                      key={date.toString()}
                      date={date}
                      w={`${100 / dailySleeps.length}%`}
                      h="100%"
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
                              onMouseLeave={() => setHoveredSleepId(undefined)}
                            />
                          ))}
                      </Box>
                    </ChartColumn>
                  ))}
                </HStack>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default SleepChart

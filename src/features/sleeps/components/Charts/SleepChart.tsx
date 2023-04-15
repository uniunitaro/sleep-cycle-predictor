import {
  Box,
  Card,
  CardBody,
  Center,
  Flex,
  HStack,
  Heading,
  StackDivider,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import {
  addDays,
  differenceInMilliseconds,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
} from 'date-fns'
import { useSleeps } from '../../apis/useSleeps'
import SleepBar from './SleepBar'
import ChartColumn from './ChartColumn'

const SleepChart = () => {
  const [displayMode, setDisplayMode] = useState<'month' | 'week'>('month')
  const [targetDate, setTargetDate] = useState(startOfMonth(new Date()))
  const startDate = targetDate
  const endDate =
    displayMode === 'month' ? endOfMonth(targetDate) : endOfWeek(targetDate)

  const { data: sleeps } = useSleeps({ start: startDate, end: endDate })

  const headerHeight = 48
  const cellHeight = 26

  const dailySleeps = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) => {
      const dailySleeps = sleeps
        ?.filter((s) => isSameDay(s.start, date) || isSameDay(s.end, date))
        .map((sleep) => {
          const start = isSameDay(sleep.start, date) ? sleep.start : date
          const end = isSameDay(sleep.end, date) ? sleep.end : addDays(date, 1)
          const barHeightPercentage =
            (differenceInMilliseconds(end, start) / 24 / 60 / 60 / 1000) * 100
          const barTopPercentage =
            (differenceInMilliseconds(start, date) / 24 / 60 / 60 / 1000) * 100

          return { ...sleep, start, end, barHeightPercentage, barTopPercentage }
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
        <Heading size="md" fontWeight="normal">
          {format(startDate, 'yyyy年M月')}
        </Heading>
        <Flex>
          <VStack mr="3" fontSize="xs" spacing="0">
            <Box h={`${headerHeight - cellHeight / 2}px`} />
            {[...Array(24)].map((_, i) => (
              <Center key={i} h={`${cellHeight}px`} color="secondaryText">
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
                // position="relative"
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
      </CardBody>
    </Card>
  )
}

export default SleepChart

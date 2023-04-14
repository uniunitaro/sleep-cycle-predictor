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
import { useSleeps } from '../apis/useSleeps'

const SleepChart = () => {
  const [displayMode, setDisplayMode] = useState<'month' | 'week'>('month')
  const [targetDate, setTargetDate] = useState(startOfMonth(new Date()))
  const startDate = targetDate
  const endDate =
    displayMode === 'month' ? endOfMonth(targetDate) : endOfWeek(targetDate)

  const { data: sleeps } = useSleeps({ start: startDate, end: endDate })

  const headerHeight = 48
  const cellHeight = 26
  const cellMinWidth = 16

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
        <Flex overflowY="auto">
          <VStack mr="3" fontSize="xs" spacing="0">
            <Box h={`${headerHeight - cellHeight / 2}px`} />
            {[...Array(24)].map((_, i) => (
              <Center key={i} h={`${cellHeight}px`}>
                {i}:00
              </Center>
            ))}
          </VStack>
          <Flex position="relative" flex="1">
            <Box>
              <Box h={`${headerHeight}px`} />
              {[...Array(24)].map((_, i) => (
                <Box
                  key={i}
                  h={`${cellHeight}px`}
                  _after={{
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    borderBottom: '1px solid',
                    borderColor: 'chakra-border-color',
                  }}
                />
              ))}
            </Box>
            <HStack
              divider={<StackDivider />}
              spacing="1"
              align="start"
              flex="1"
            >
              {dailySleeps.map(({ date, sleeps }) => (
                <Flex
                  key={date.toString()}
                  minW={`${cellMinWidth}px`}
                  w={`${100 / dailySleeps.length}%`}
                  h="100%"
                  direction="column"
                >
                  <Center h={`${headerHeight}px`}>{format(date, 'd')}</Center>
                  <Box position="relative" height="100%" flex="1">
                    {sleeps &&
                      sleeps.map((sleep) => (
                        <Box
                          key={date.toString() + sleep.id}
                          position="absolute"
                          w="100%"
                          h={`${sleep.barHeightPercentage}%`}
                          top={`${sleep.barTopPercentage}%`}
                          bg={
                            hoveredSleepId === sleep.id
                              ? 'brand.300'
                              : 'brand.200'
                          }
                          boxShadow={
                            hoveredSleepId === sleep.id ? 'md' : 'none'
                          }
                          borderRadius="md"
                          onMouseEnter={() => setHoveredSleepId(sleep.id)}
                          onMouseLeave={() => setHoveredSleepId(undefined)}
                        />
                      ))}
                  </Box>
                </Flex>
              ))}
            </HStack>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default SleepChart

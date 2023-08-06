'use client'

import {
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
  experimental_useOptimistic as useOptimistic,
  memo,
} from 'react'
import {
  addDays,
  addMonths,
  differenceInMilliseconds,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import {
  PanInfo,
  motion,
  useAnimationControls,
  useDragControls,
} from 'framer-motion'
import { useRouter } from 'next/navigation'
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
import CardMdOnly from '@/components/CardMdOnly/CardMdOnly'
import CardBodyMdOnly from '@/components/CardBodyMdOnly'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { useCalendarControl } from '@/features/sleep/hooks/useCalendarControl'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
}
const SleepChart: FC<Props> = memo(({ sleeps, predictions, targetDate }) => {
  const [displayMode, setDisplayMode] = useState<'month' | 'week'>('month')
  const [optimisticTargetDate, setOptimisticTargetDate] =
    useOptimistic(targetDate)

  const startDate =
    displayMode === 'month'
      ? startOfMonth(optimisticTargetDate)
      : startOfWeek(optimisticTargetDate)
  const endDate =
    displayMode === 'month'
      ? endOfMonth(optimisticTargetDate)
      : endOfWeek(optimisticTargetDate)

  const headerHeight = 48

  const generateDailySleeps = (startDate: Date, endDate: Date) => {
    const dailySleeps = eachDayOfInterval({
      start: startDate,
      end: endDate,
    }).map((date) => {
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
    })
    return dailySleeps
  }

  const dailySleeps = generateDailySleeps(startDate, endDate)
  const previousDailySleeps = generateDailySleeps(
    startOfMonth(subMonths(optimisticTargetDate, 1)),
    endOfMonth(subMonths(optimisticTargetDate, 1))
  )
  const nextDailySleeps = generateDailySleeps(
    startOfMonth(addMonths(optimisticTargetDate, 1)),
    endOfMonth(addMonths(optimisticTargetDate, 1))
  )

  const chartRef = useRef<HTMLDivElement>(null)
  const chartDimensions = useDimensions(chartRef, true)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartContainerDimensions = useDimensions(chartContainerRef, true)

  const scrollBarHeight =
    (chartContainerDimensions?.contentBox.height ?? 0) -
    (chartDimensions?.contentBox.height ?? 0)

  const currentChartRef = useRef<HTMLDivElement>(null)

  return (
    <CardMdOnly h="100%">
      <CardBodyMdOnly h="100%" py={{ base: 2, md: 5 }}>
        <Stack h="100%">
          <ChartHeader targetDate={targetDate} />
          <Flex flex="1" overflowY="auto">
            <Flex position="relative" flex="1" minH="400px" overflowX="auto">
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
              <Flex flex="1" ref={chartContainerRef}>
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
                  <DragContainer
                    targetDate={targetDate}
                    currentChartRef={currentChartRef}
                    onDateChange={(date) => setOptimisticTargetDate(date)}
                  >
                    {[previousDailySleeps, dailySleeps, nextDailySleeps].map(
                      (dailySleeps, i) => (
                        <Flex
                          key={dailySleeps[0].date.getTime()}
                          ref={i === 1 ? currentChartRef : undefined}
                          flex="1"
                          position="absolute"
                          w="full"
                          h="full"
                          right={i === 0 ? '100%' : undefined}
                          left={i === 2 ? '100%' : undefined}
                          overflowX="scroll"
                        >
                          <ChartContent dailySleeps={dailySleeps} />
                        </Flex>
                      )
                    )}
                  </DragContainer>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Stack>
      </CardBodyMdOnly>
    </CardMdOnly>
  )
})

SleepChart.displayName = 'SleepChart'

const DragContainer: FC<{
  targetDate: Date
  currentChartRef: RefObject<HTMLDivElement>
  onDateChange: (date: Date) => void
  children: ReactNode
}> = ({ targetDate, currentChartRef, onDateChange, children }) => {
  const dragContainerRef = useRef<HTMLDivElement>(null)
  const dragContainerDimensions = useDimensions(dragContainerRef, true)
  const dragContainerWidth = dragContainerDimensions?.contentBox.width ?? 0

  const dragControls = useDragControls()
  const controls = useAnimationControls()

  const touchStartX = useRef<number>()
  const canStartDrag = useRef(false)
  const isDragging = useRef(false)
  const currentEdgeType = useRef<'left' | 'right'>()

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].pageX
  }
  const handleTouchMove = (e: TouchEvent) => {
    // スクロールの端に到達していて、さらに端の方向にスクロールをしようとした場合にスクロール判定を消す
    const chartRef = currentChartRef.current
    if (!chartRef) return

    const isOnLeftEdge = chartRef.scrollLeft === 0
    const isOnRightEdge =
      Math.abs(
        (chartRef.scrollWidth ?? 0) -
          (chartRef.clientWidth ?? 0) -
          (chartRef.scrollLeft ?? 0)
      ) < 1

    // 左方向へのスワイプ = 右へ移動
    const isSwipingLeft = e.touches[0].pageX < (touchStartX.current ?? 0)
    // 右方向へのスワイプ = 左へ移動
    const isSwipingRight = e.touches[0].pageX > (touchStartX.current ?? 0)

    if ((isOnLeftEdge && isSwipingRight) || (isOnRightEdge && isSwipingLeft)) {
      e.preventDefault()

      currentEdgeType.current = isOnLeftEdge ? 'left' : 'right'
      if (!isDragging.current) {
        canStartDrag.current = true
      }
    }
  }
  const handleTouchEnd = () => {
    isDragging.current = false
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (canStartDrag.current) {
      dragControls.start(e)
      canStartDrag.current = false
      isDragging.current = true
    }
  }

  const router = useRouter()
  const { previousLink, nextLink, previousDate, nextDate } =
    useCalendarControl(targetDate)
  useEffect(() => {
    router.prefetch(previousLink)
    router.prefetch(nextLink)
  }, [nextLink, previousLink, router])

  const handleDragEnd = async (info: PanInfo) => {
    const shouldSnapToPrevious =
      currentEdgeType.current !== 'right' &&
      (info.offset.x > dragContainerWidth / 2 || info.velocity.x > 20)
    const shouldSnapToNext =
      currentEdgeType.current !== 'left' &&
      (info.offset.x < -dragContainerWidth / 2 || info.velocity.x < -20)

    currentEdgeType.current = undefined

    if (shouldSnapToPrevious) {
      await controls.start('previous')
      // アニメーションが終わったらスクロール位置を戻す
      controls.start({ x: 0, transition: { duration: 0 } })
      if (currentChartRef.current) {
        // 今まで表示していたチャートのスクロール位置を戻す
        currentChartRef.current.scrollLeft = 0
      }
      onDateChange(previousDate)
      router.push(previousLink, { scroll: false })
    } else if (shouldSnapToNext) {
      await controls.start('next')
      if (currentChartRef.current) {
        currentChartRef.current.scrollLeft = 0
      }
      controls.start({ x: 0, transition: { duration: 0 } })
      onDateChange(nextDate)
      router.push(nextLink, { scroll: false })
    } else {
      controls.start('current')
    }
  }

  useEffect(() => {
    const chartRef = currentChartRef.current
    chartRef?.addEventListener('touchstart', handleTouchStart)
    chartRef?.addEventListener('touchmove', handleTouchMove)
    chartRef?.addEventListener('touchend', handleTouchEnd)
    return () => {
      chartRef?.removeEventListener('touchstart', handleTouchStart)
      chartRef?.removeEventListener('touchmove', handleTouchMove)
      chartRef?.removeEventListener('touchend', handleTouchEnd)
    }
  })

  return (
    <Flex
      ref={dragContainerRef}
      flex="1"
      position="relative"
      overflowX="hidden"
    >
      <motion.div
        style={{ display: 'flex', flex: '1' }}
        dragControls={dragControls}
        dragListener={false}
        onPointerMove={handlePointerMove}
        drag={'x'}
        dragConstraints={{
          left: -dragContainerWidth,
          right: dragContainerWidth,
        }}
        onDragEnd={(_, info) => handleDragEnd(info)}
        animate={controls}
        variants={{
          current: { x: 0 },
          previous: { x: dragContainerWidth },
          next: { x: -dragContainerWidth },
        }}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </Flex>
  )
}

type DailySleep = {
  date: Date
  sleeps: {
    start: Date
    end: Date
    barHeightPercentage: number
    barTopPercentage: number
    isPrediction: unknown
    id: number
  }[]
}
const ChartContent: FC<{ dailySleeps: DailySleep[] }> = ({ dailySleeps }) => {
  const [hoveredSleepId, setHoveredSleepId] = useState<number>()

  return (
    <HStack divider={<StackDivider />} spacing="0" align="start" flex="1">
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
                  onMouseLeave={() => setHoveredSleepId(undefined)}
                />
              ))}
          </Box>
        </ChartColumn>
      ))}
    </HStack>
  )
}

export default SleepChart

'use client'

import {
  FC,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
  memo,
  forwardRef,
} from 'react'
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInMilliseconds,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns'
import {
  PanInfo,
  motion,
  useAnimationControls,
  useDragControls,
} from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai'
import ChartColumn from '../ChartColumn'
import SleepBar from '../SleepBar'
import ChartHeader from '../ChartHeader'
import SleepOverview, { SleepOverviewRef } from '../../Lists/SleepOverview'
import {
  isSleepBottomSheetOpenAtom,
  selectedSleepOrPredictionAtom,
} from '../../atoms/globalModals'
import {
  Box,
  Center,
  Flex,
  HStack,
  Hide,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Show,
  Stack,
  StackDivider,
  VStack,
  useBreakpointValue,
  useDimensions,
  useDisclosure,
  useOutsideClick,
} from '@/components/chakra'
import CardMdOnly from '@/components/MdOnlyCards/CardMdOnly/CardMdOnly'
import CardBodyMdOnly from '@/components/MdOnlyCards/CardBodyMdOnly'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { useCalendarControl } from '@/features/sleep/hooks/useCalendarControl'
import { DisplayMode } from '@/features/sleep/types/chart'
import { useOptimistic } from '@/features/sleep/hooks/useOptimistic'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}
const SleepChart: FC<Props> = memo(
  ({ sleeps, predictions, targetDate, displayMode }) => {
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

    const generateDailySleepsList = (
      startDate: Date,
      endDate: Date
    ): DailySleeps[] => {
      const dailySleepsList = eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).map((date) => {
        const formattedPredictions = predictions.map((p, i) => ({
          ...p,
          // sleepのidと重複しないように負の値にしている
          id: -i,
          isPrediction: true,
        }))

        const formattedSleeps = sleeps.flatMap((sleep) =>
          sleep.sleeps.map((s) => ({
            ...s,
            id: sleep.id,
          }))
        )

        const dailySleeps = [...formattedSleeps, ...formattedPredictions]
          .filter((s) => isSameDay(s.start, date) || isSameDay(s.end, date))
          .map((sleep) => {
            const start = isSameDay(sleep.start, date) ? sleep.start : date
            const end = isSameDay(sleep.end, date)
              ? sleep.end
              : addDays(date, 1)
            const barHeightPercentage =
              (differenceInMilliseconds(end, start) / 24 / 60 / 60 / 1000) * 100
            const barTopPercentage =
              (differenceInMilliseconds(start, date) / 24 / 60 / 60 / 1000) *
              100
            const originalSleep = sleeps.find((s) => s.id === sleep.id)
            const formattedPrediction = formattedPredictions.find(
              (p) => p.id === sleep.id
            )
            const originalPrediction = formattedPrediction && {
              start: formattedPrediction.start,
              end: formattedPrediction.end,
            }

            return {
              ...sleep,
              start,
              end,
              barHeightPercentage,
              barTopPercentage,
              isPrediction:
                'isPrediction' in sleep ? !!sleep.isPrediction : false,
              originalSleep,
              originalPrediction,
            }
          })
        return {
          date,
          sleeps: dailySleeps,
        }
      })
      return dailySleepsList
    }

    const dailySleepsList = generateDailySleepsList(startDate, endDate)
    const previousDailySleepsList = generateDailySleepsList(
      displayMode === 'month'
        ? startOfMonth(subMonths(optimisticTargetDate, 1))
        : startOfWeek(subWeeks(optimisticTargetDate, 1)),
      displayMode === 'month'
        ? endOfMonth(subMonths(optimisticTargetDate, 1))
        : endOfWeek(subWeeks(optimisticTargetDate, 1))
    )
    const nextDailySleepsList = generateDailySleepsList(
      displayMode === 'month'
        ? startOfMonth(addMonths(optimisticTargetDate, 1))
        : startOfWeek(addWeeks(optimisticTargetDate, 1)),
      displayMode === 'month'
        ? endOfMonth(addMonths(optimisticTargetDate, 1))
        : endOfWeek(addWeeks(optimisticTargetDate, 1))
    )

    const currentChartRef = useRef<HTMLDivElement>(null)
    const currentChartDimensions = useDimensions(currentChartRef, true)

    const chartContentRef = useRef<HTMLDivElement>(null)
    const chartContentDimensions = useDimensions(chartContentRef, true)

    const scrollBarHeight =
      (currentChartDimensions?.contentBox.height ?? 0) -
      (chartContentDimensions?.contentBox.height ?? 0)

    return (
      <CardMdOnly h="100%" minH="0">
        <CardBodyMdOnly h="100%" py={{ base: 2, md: 5 }}>
          <Stack h="100%">
            <Box px={{ base: 4, md: 0 }}>
              <ChartHeader
                targetDate={optimisticTargetDate}
                displayMode={displayMode}
              />
            </Box>
            <Flex flex="1" overflowY="auto">
              <Flex position="relative" flex="1" minH="400px" overflowX="auto">
                <VStack
                  mr="3"
                  fontSize="xs"
                  spacing="0"
                  pl={{ base: 4, md: 0 }}
                  align="end"
                >
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
                <Flex flex="1">
                  <Flex position="relative" flex="1">
                    <Box>
                      <Box h={`${headerHeight}px`} />
                      {[...Array(24)].map((_, i) => (
                        <Box
                          key={i}
                          h={`calc((100% - ${
                            headerHeight + scrollBarHeight
                          }px) / 24)`}
                        >
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
                      displayMode={displayMode}
                      currentChartRef={currentChartRef}
                      onDateChange={(date) => {
                        setOptimisticTargetDate(date)
                      }}
                    >
                      {[
                        previousDailySleepsList,
                        dailySleepsList,
                        nextDailySleepsList,
                      ].map((dailySleepsList, i) => (
                        <Flex
                          key={dailySleepsList[0].date.getTime()}
                          ref={i === 1 ? currentChartRef : undefined}
                          flex="1"
                          position="absolute"
                          w="full"
                          h="full"
                          right={i === 0 ? '100%' : undefined}
                          left={i === 2 ? '100%' : undefined}
                          overflowX="scroll"
                        >
                          <ChartContent
                            dailySleepsList={dailySleepsList}
                            ref={i === 1 ? chartContentRef : undefined}
                          />
                        </Flex>
                      ))}
                    </DragContainer>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Stack>
        </CardBodyMdOnly>
      </CardMdOnly>
    )
  }
)

SleepChart.displayName = 'SleepChart'

const DragContainer: FC<{
  targetDate: Date
  displayMode: DisplayMode
  currentChartRef: RefObject<HTMLDivElement>
  onDateChange: (date: Date) => void
  children: ReactNode
}> = ({ targetDate, displayMode, currentChartRef, onDateChange, children }) => {
  const dragContainerRef = useRef<HTMLDivElement>(null)
  const dragContainerDimensions = useDimensions(dragContainerRef, true)
  const dragContainerWidth = dragContainerDimensions?.contentBox.width ?? 0

  const dragControls = useDragControls()
  const controls = useAnimationControls()

  const touchStartX = useRef<number>()
  const canStartDrag = useRef(false)
  const isDragging = useRef(false)
  const currentEdgeType = useRef<'left' | 'right' | 'both'>()

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

      currentEdgeType.current =
        isOnLeftEdge && isOnRightEdge ? 'both' : isOnLeftEdge ? 'left' : 'right'
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
  const { previousLink, nextLink, previousDate, nextDate } = useCalendarControl(
    targetDate,
    displayMode
  )
  useEffect(() => {
    router.prefetch(previousLink)
    router.prefetch(nextLink)
  }, [nextLink, previousLink, router])

  const handleDragEnd = async (info: PanInfo) => {
    const shouldSnapToPrevious =
      (currentEdgeType.current === 'both' ||
        currentEdgeType.current === 'left') &&
      (info.offset.x > dragContainerWidth / 2 || info.velocity.x > 20)
    const shouldSnapToNext =
      (currentEdgeType.current === 'both' ||
        currentEdgeType.current === 'right') &&
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
        drag="x"
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

type DailySleeps = {
  date: Date
  sleeps: {
    start: Date
    end: Date
    barHeightPercentage: number
    barTopPercentage: number
    isPrediction: boolean
    id: number
    originalSleep: Sleep | undefined
    originalPrediction: Prediction | undefined
  }[]
}
const ChartContent = forwardRef<
  HTMLDivElement,
  { dailySleepsList: DailySleeps[] }
>(({ dailySleepsList }, ref) => {
  const [hoveredSleepId, setHoveredSleepId] = useState<number>()

  return (
    <HStack
      divider={<StackDivider />}
      spacing="0"
      align="start"
      flex="1"
      ref={ref}
    >
      {dailySleepsList.map(({ date, sleeps }) => (
        <ChartColumn
          key={date.getTime()}
          date={date}
          w={`${100 / dailySleepsList.length}%`}
          h="full"
        >
          <Box position="relative" h="full" flex="1" px="15%">
            <Box position="relative" h="full">
              {sleeps &&
                sleeps.map((sleep) => (
                  <SleepBarWithDetail
                    key={sleep.start.getTime()}
                    sleep={sleep}
                    isHovered={hoveredSleepId === sleep.id}
                    setHoveredSleepId={setHoveredSleepId}
                  />
                ))}
            </Box>
          </Box>
        </ChartColumn>
      ))}
    </HStack>
  )
})

ChartContent.displayName = 'ChartContent'

const SleepBarWithDetail: FC<{
  sleep: DailySleeps['sleeps'][number]
  isHovered: boolean
  setHoveredSleepId: (id: number | undefined) => void
}> = memo(({ sleep, isHovered, setHoveredSleepId }) => {
  const { isOpen, onToggle, onClose } = useDisclosure()
  const popoverContentRef = useRef<HTMLElement>(null)
  const SleepBarRef = useRef<HTMLDivElement>(null)
  const sleepOverviewRef = useRef<SleepOverviewRef>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  useOutsideClick({
    ref: popoverContentRef,
    handler: (e) => {
      const isModalOpen = !!sleepOverviewRef.current?.modalRef.current
      const isClickedSleepBar = SleepBarRef.current?.contains(e.target as Node)
      if (isMobile || isModalOpen || isClickedSleepBar) return

      onClose()
    },
  })

  const setSelectedSleepOrPrediction = useSetAtom(selectedSleepOrPredictionAtom)
  const setIsSleepBottomSheetOpen = useSetAtom(isSleepBottomSheetOpenAtom)

  const handleClick = () => {
    setSelectedSleepOrPrediction(
      sleep.originalSleep ?? sleep.originalPrediction
    )
    setIsSleepBottomSheetOpen(true)
    onToggle()
  }

  const sleepBar = (
    <SleepBar
      ref={SleepBarRef}
      isHoveredOrSelected={isHovered || isOpen}
      position="absolute"
      w="100%"
      h={`${sleep.barHeightPercentage}%`}
      top={`${sleep.barTopPercentage}%`}
      barColor={sleep.isPrediction ? 'blue' : 'brand'}
      onMouseEnter={() => setHoveredSleepId(sleep.id)}
      onMouseLeave={() => setHoveredSleepId(undefined)}
      onClick={handleClick}
      // TODO アクセシビリティ考慮
      tabIndex={0}
      cursor="pointer"
    />
  )

  return (
    <>
      <Show above="md">
        <Popover
          isLazy
          placement="right"
          closeOnBlur={false}
          isOpen={!isMobile && isOpen}
          onClose={onClose}
          initialFocusRef={popoverContentRef}
        >
          <PopoverTrigger>{sleepBar}</PopoverTrigger>
          <PopoverContent w="auto" ref={popoverContentRef}>
            <PopoverArrow />
            <PopoverBody>
              {sleep.originalSleep && (
                <SleepOverview
                  sleep={sleep.originalSleep}
                  variant="withMenu"
                  ref={sleepOverviewRef}
                />
              )}
              {sleep.originalPrediction && (
                <SleepOverview prediction={sleep.originalPrediction} />
              )}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Show>
      <Hide above="md">{sleepBar}</Hide>
    </>
  )
})

SleepBarWithDetail.displayName = 'SleepBarWithDetail'

export default SleepChart

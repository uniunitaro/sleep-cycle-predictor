'use client'

import { FC, ReactNode, useEffect, useRef } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { useAtomValue } from 'jotai'
import SleepInputModal from '../inputs/SleepInputModal/SleepInputModal'
import { Prediction, Sleep } from '../../types/sleep'
import RightColumn from '../RightColumn'
import { DisplayMode } from '../../types/chart'
import GlobalModals from '../GlobalModals'
import SleepList from '../Lists/SleepList'
import PWAInstallModal from '../PWAInstallModal'
import { useCalendarWithEvents } from '../../hooks/useCalendarWithEvents'
import SleepChart from './SleepChart/SleepChart'
import ChartHeader from './ChartHeader'
import { isRightColumnOpenAtom } from '@/features/sleep/atoms/rightColumn'
import {
  Box,
  Container,
  Flex,
  Grid,
  Hide,
  Show,
  SlideFade,
  useDisclosure,
} from '@/components/chakra'
import FAB from '@/components/FAB/FAB'
import { useHistoriedModal } from '@/hooks/useHistoriedModal'
import { Calendar } from '@/db/schema'

const SleepChartContainer: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  hasTargetDate: boolean
  displayMode: DisplayMode
  isPublic: boolean
  userHeading?: ReactNode
  calendars?: Calendar[]
}> = ({
  sleeps,
  predictions,
  targetDate,
  hasTargetDate,
  displayMode,
  isPublic,
  userHeading,
  calendars,
}) => {
  const { isOpen, onOpen, onClose } = useHistoriedModal()

  const listContainerRef = useRef<HTMLDivElement>(null)
  const previousPos = useRef(0)
  const {
    isOpen: isFABOpen,
    onOpen: onFABOpen,
    onClose: onFABClose,
  } = useDisclosure({ defaultIsOpen: true })
  const handleScroll = () => {
    if (!listContainerRef.current) return
    const currentPos = listContainerRef.current.scrollTop
    if (currentPos > previousPos.current) {
      onFABClose()
    } else {
      onFABOpen()
    }
    previousPos.current = currentPos
  }
  useEffect(() => {
    const listContainer = listContainerRef.current
    listContainer?.addEventListener('scroll', handleScroll)
    return () => listContainer?.removeEventListener('scroll', handleScroll)
  })

  const isRightColumnOpen = useAtomValue(isRightColumnOpenAtom)

  /**
   * クライアントのタイムゾーンにおけるtargetDate
   *
   * targetDateが指定されているとき
   * targetDateが2023-01-01T00:00:00.000Zのとき、
   * Asia/Tokyoの場合は2023-01-01T00:00:00.000+09:00
   *
   * targetDateが指定されていないとき
   * クライアントの現在日時
   */
  const zonedTargetDate = hasTargetDate
    ? new Date(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate()
      )
    : new Date()

  const calendarWithEvents = useCalendarWithEvents(
    isPublic ? [] : calendars ?? []
  )

  return (
    <Box as="main" h="full">
      <Container
        maxW="8xl"
        h="full"
        px={{ base: 0, md: 6 }}
        pb={{ base: 0, md: 4 }}
        bg={{ base: 'contentBg', md: 'transparent' }}
      >
        <Flex direction="column" h="full">
          {userHeading}
          <Box flex="1" minH="0">
            {displayMode !== 'list' && (
              <Grid
                h="full"
                templateColumns={{
                  base: undefined,
                  md: isRightColumnOpen ? '1fr 336px' : '1fr 0px',
                }}
                transition="all 0.3s"
                overflow="hidden"
              >
                <SleepChart
                  sleeps={sleeps}
                  predictions={predictions}
                  targetDate={zonedTargetDate}
                  displayMode={displayMode}
                  isPublic={isPublic}
                  calendarWithEvents={calendarWithEvents}
                />
                <Show above="md">
                  <Box
                    minH="0"
                    pl="4"
                    w="336px"
                    aria-hidden={!isRightColumnOpen}
                  >
                    <RightColumn
                      sleeps={sleeps}
                      predictions={predictions}
                      targetDate={zonedTargetDate}
                      isPublic={isPublic}
                    />
                  </Box>
                </Show>
              </Grid>
            )}
            {displayMode === 'list' && (
              <Flex direction="column" h="full" overflow="auto" pt="2" pb="4">
                <Box mb="3" px="4">
                  <ChartHeader
                    targetDate={zonedTargetDate}
                    displayMode="month"
                    isPublic={isPublic}
                  />
                </Box>
                <Box ref={listContainerRef} overflowY="auto" px="6" flex="1">
                  <SleepList
                    sleeps={sleeps}
                    predictions={predictions}
                    targetDate={zonedTargetDate}
                    variant="mobile"
                    isPublic={isPublic}
                  />
                </Box>
              </Flex>
            )}
            {!isPublic && (
              <Hide above="md">
                <SlideFade in={isFABOpen}>
                  <FAB
                    icon={<AddIcon />}
                    aria-label="睡眠記録を追加"
                    colorScheme="green"
                    onClick={onOpen}
                  />
                </SlideFade>
                <SleepInputModal isOpen={isOpen} onClose={onClose} />
              </Hide>
            )}
            {!isPublic && <PWAInstallModal />}
            <GlobalModals />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default SleepChartContainer

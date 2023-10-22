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

const SleepChartContainer: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
  isPublic: boolean
  userHeading?: ReactNode
}> = ({
  sleeps,
  predictions,
  targetDate,
  displayMode,
  isPublic,
  userHeading,
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
                  targetDate={targetDate}
                  displayMode={displayMode}
                  isPublic={isPublic}
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
                      targetDate={targetDate}
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
                    targetDate={targetDate}
                    displayMode="month"
                    isPublic={false}
                  />
                </Box>
                <Box ref={listContainerRef} overflowY="auto" px="6">
                  <SleepList
                    sleeps={sleeps}
                    predictions={predictions}
                    targetDate={targetDate}
                    variant="mobile"
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
            <GlobalModals />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default SleepChartContainer

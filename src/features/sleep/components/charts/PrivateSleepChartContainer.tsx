'use client'

import { FC, useEffect, useRef } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import SleepInputModal from '../inputs/SleepInputModal/SleepInputModal'
import { Prediction, Sleep } from '../../types/sleep'
import RightColumn from '../RightColumn'
import { DisplayMode } from '../../types/chart'
import GlobalModals from '../GlobalModals'
import SleepList from '../Lists/SleepList'
import SleepChart from './SleepChart/SleepChart'
import ChartHeader from './ChartHeader'
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

const PrivateSleepChartContainer: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}> = ({ sleeps, predictions, targetDate, displayMode }) => {
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

  return (
    <Box as="main" h="full">
      <Container
        maxW="8xl"
        h="full"
        px={{ base: 0, md: 4 }}
        pb={{ base: 0, md: 4 }}
        bg={{ base: 'contentBg', md: 'transparent' }}
      >
        {displayMode !== 'list' && (
          <Grid
            h="full"
            templateColumns={{ base: undefined, md: '1fr 320px' }}
            gap="4"
          >
            <SleepChart
              sleeps={sleeps}
              predictions={predictions}
              targetDate={targetDate}
              displayMode={displayMode}
            />
            <Show above="md">
              <RightColumn
                sleeps={sleeps}
                predictions={predictions}
                targetDate={targetDate}
              />
            </Show>
          </Grid>
        )}
        {displayMode === 'list' && (
          <Flex direction="column" h="full" overflow="auto" pt="2" pb="4">
            <Box mb="3" px="4">
              <ChartHeader targetDate={targetDate} displayMode="month" />
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
        <GlobalModals />
      </Container>
    </Box>
  )
}

export default PrivateSleepChartContainer

'use client'

import { FC } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import SleepInputModal from '../inputs/SleepInputModal/SleepInputModal'
import { Prediction, Sleep } from '../../types/sleep'
import RightColumn from '../RightColumn'
import { DisplayMode } from '../../types/chart'
import SleepChart from './SleepChart/SleepChart'
import { Box, Container, Grid, Show } from '@/components/chakra'
import FAB from '@/components/FAB/FAB'
import { useHistoriedModal } from '@/hooks/useHistoriedModal'

const PrivateSleepChartContainer: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}> = ({ sleeps, predictions, targetDate, displayMode }) => {
  const { isOpen, onOpen, onClose } = useHistoriedModal()

  return (
    <Box as="main" h="100%">
      <Container
        maxW="8xl"
        h="100%"
        px={{ base: 0, md: 4 }}
        pb={{ base: 0, md: 4 }}
        bg={{ base: 'contentBg', md: 'transparent' }}
      >
        <Grid
          h="100%"
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
        <Show below="md">
          <FAB
            icon={<AddIcon />}
            aria-label="睡眠記録を追加"
            colorScheme="green"
            onClick={onOpen}
          />
          <SleepInputModal isOpen={isOpen} onClose={onClose} />
        </Show>
      </Container>
    </Box>
  )
}

export default PrivateSleepChartContainer

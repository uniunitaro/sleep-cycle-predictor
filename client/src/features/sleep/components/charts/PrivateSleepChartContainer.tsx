'use client'

import { FC } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import SleepInput from '../inputs/SleepInput/SleepInput'
import SleepInputModal from '../inputs/SleepInputModal/SleepInputModal'
import { Prediction, Sleep } from '../../types/sleep'
import SleepChart from './SleepChart/SleepChart'
import { Box, Container, Grid, Show } from '@/components/chakra'
import FAB from '@/components/FAB/FAB'
import { useHistoriedModal } from '@/hooks/useHistoriedModal'

const PrivateSleepChartContainer: FC<{
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
}> = ({ sleeps, predictions, targetDate }) => {
  const { isOpen, onOpen, onClose } = useHistoriedModal()

  return (
    <Box as="main" h="100%">
      <Container
        maxW="8xl"
        h="100%"
        px={{ base: 0, md: 4 }}
        py={{ base: 0, md: 4 }}
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
            isLoading={false}
            targetDate={targetDate}
          />
          <Show above="md">
            <SleepInput />
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

'use client'

import { FC } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { Box, Container, Grid, Show } from '@/app/_components/chakra'
import { useHistoriedModal } from '@/hooks/useHistoriedModal'
import SleepInput from '@/app/(sleep)/components/inputs/SleepInput/SleepInput'
import PrivateSleepChartContainer from '@/app/(sleep)/components/charts/PrivateSleepChartContainer'
import FAB from '@/app/_components/FAB/FAB'
import SleepInputModal from '@/app/(sleep)/components/inputs/SleepInputModal/SleepInputModal'

const Home: FC = () => {
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
          <PrivateSleepChartContainer />
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

export default Home

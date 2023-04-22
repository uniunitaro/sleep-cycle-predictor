import Head from 'next/head'
import { Box, Container, Flex, Grid, Show } from '@chakra-ui/react'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { AddIcon } from '@chakra-ui/icons'
import { NextPageWithLayout } from './_app'
import SignedInLayout from '@/components/SignedInLayout'
import SleepInput from '@/features/sleeps/components/Inputs/SleepInput'
import SleepChart from '@/features/sleeps/components/Charts/SleepChart'
import FAB from '@/components/FAB'
import SleepInputModal from '@/features/sleeps/components/Inputs/SleepInputModal'
import { useHistoriedModal } from '@/hooks/useHistoriedModal'

const Home: NextPageWithLayout = () => {
  const { isOpen, onOpen, onClose } = useHistoriedModal()

  return (
    <>
      <Head>
        <title>ホーム - Sleep Cycle Predictor</title>
      </Head>
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
            <Box minH="0" minW="0">
              <SleepChart />
            </Box>
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
    </>
  )
}

Home.getLayout = (page) => <SignedInLayout>{page}</SignedInLayout>

export default withAuthUser<NextPageWithLayout>({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home)

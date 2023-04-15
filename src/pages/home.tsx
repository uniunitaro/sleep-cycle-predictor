import Head from 'next/head'
import { Container, Grid } from '@chakra-ui/react'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { NextPageWithLayout } from './_app'
import SignedInLayout from '@/components/SignedInLayout'
import SleepInput from '@/features/sleeps/components/Inputs/SleepInput'
import SleepChart from '@/features/sleeps/components/Charts/SleepChart'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>ホーム - Sleep Cycle Predictor</title>
      </Head>
      <main>
        <Container maxW="8xl" py="4">
          <Grid templateColumns={{ base: undefined, md: '1fr 320px' }} gap="4">
            <SleepChart />
            <SleepInput />
          </Grid>
        </Container>
      </main>
    </>
  )
}

Home.getLayout = (page) => <SignedInLayout>{page}</SignedInLayout>

export default withAuthUser<NextPageWithLayout>({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Home)

import Head from 'next/head'
import { Button, ButtonGroup, Center, Container } from '@chakra-ui/react'
import Link from 'next/link'
import { AuthAction, withAuthUser } from 'next-firebase-auth'
import { NextPageWithLayout } from './_app'
import SignedInLayout from '@/components/SignedInLayout'
import SleepInput from '@/features/sleeps/components/SleepInput'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>ホーム - Sleep Cycle Predictor</title>
      </Head>
      <main>
        <Container maxW="800px" py="4">
          <SleepInput />
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

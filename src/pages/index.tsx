import Head from 'next/head'
import { Button, ButtonGroup, Center, Container } from '@chakra-ui/react'
import Link from 'next/link'
import { NextPageWithLayout } from './_app'
import Layout from '@/components/Layout'

const Index: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Sleep Cycle Predictor</title>
        <meta
          name="description"
          content="毎日ずれてゆくあなたの睡眠サイクルを華麗に予測！"
        />
      </Head>
      <main>
        <Container maxW="800px" py="4">
          <Center>
            <ButtonGroup spacing="8" size="lg">
              <Link href="/signin" passHref legacyBehavior>
                <Button as="a" colorScheme="green" variant="outline">
                  ログイン
                </Button>
              </Link>
              <Link href="/signup" passHref legacyBehavior>
                <Button as="a" colorScheme="green">
                  会員登録
                </Button>
              </Link>
            </ButtonGroup>
          </Center>
        </Container>
      </main>
    </>
  )
}

Index.getLayout = (page) => <Layout>{page}</Layout>

export default Index

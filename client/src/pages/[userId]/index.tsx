import Head from 'next/head'
import { Box, Container, Flex, Heading, Show } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from '../_app'
import SignedOutLayout from '@/components/SignedOutLayout'
import PublicSleepChartContainer from '@/features/sleeps/components/Charts/PublicSleepChartContainer'
import { useUser } from '@/features/users/apis/useUser'

const UserIndex: NextPageWithLayout = () => {
  const router = useRouter()
  const { userId } = router.query

  const { data: user } = useUser(userId as string)
  return (
    <>
      <Head>
        <title>
          {user
            ? `${user.nickname}さんの睡眠予測 - Sleep Cycle Predictor`
            : 'Sleep Cycle Predictor'}
        </title>
      </Head>
      <Box as="main" h="100%">
        <Container
          maxW="1000px"
          h="100%"
          px={{ base: 0, md: 4 }}
          py={{ base: 0, md: 4 }}
          bg={{ base: 'contentBg', md: 'transparent' }}
        >
          <Show above="md">
            <Flex direction="column" h="100%">
              <Heading
                size={{ base: 'sm', md: 'md' }}
                p="2"
                // TODO 時刻ラベルを直して高さの指定を消す
                h={{ base: undefined, md: '45px' }}
              >
                {user && `${user.nickname}さんの睡眠予測`}
              </Heading>
              <Box
                flex="1"
                minH={{ base: '100vh', md: '0' }}
                h={{ base: '100vh', md: undefined }}
                maxH={{ base: '100vh', md: undefined }}
              >
                <PublicSleepChartContainer userId={userId as string} />
              </Box>
            </Flex>
          </Show>
          <Show below="md">
            <Heading size="sm" p="2">
              {user && `${user.nickname}さんの睡眠予測`}
            </Heading>
            <Box h="100vh">
              <PublicSleepChartContainer userId={userId as string} />
            </Box>
          </Show>
        </Container>
      </Box>
    </>
  )
}

UserIndex.getLayout = (page) => <SignedOutLayout>{page}</SignedOutLayout>

export default UserIndex

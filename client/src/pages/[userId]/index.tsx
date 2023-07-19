import Head from 'next/head'
import { Box, Container, Flex, Heading } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextPageWithLayout } from '../_app'
import SignedOutLayout from '@/components/SignedOutLayout/SignedOutLayout'
import PublicSleepChartContainer from '@/features/sleeps/components/charts/PublicSleepChartContainer'
import { getUser } from '@/features/users/apis/useUser'
import { User } from '@/features/users/types/user'

type Props = {
  user: User
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!params) return { notFound: true }

  const user = await getUser(params.userId as string)
  return {
    props: {
      user,
    },
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const UserIndex: NextPageWithLayout<Props> = ({ user }) => {
  const router = useRouter()
  const { userId } = router.query

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
          <Flex direction="column" h="100%">
            <Heading size={{ base: 'sm', md: 'md' }} px="4" py="2">
              {user && `${user.nickname}さんの睡眠予測`}
            </Heading>
            <Box flex="1" minH="0">
              <PublicSleepChartContainer userId={userId as string} />
            </Box>
          </Flex>
        </Container>
      </Box>
    </>
  )
}

UserIndex.getLayout = (page) => <SignedOutLayout>{page}</SignedOutLayout>

export default UserIndex

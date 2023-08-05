import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Box, Container, Flex, Heading } from '@/components/chakra'
import { User } from '@/features/user/types/user'
import { Prediction } from '@/features/sleep/types/sleep'

// TODO テスタビリティ的にasyncなRSCはContainerコンポーネント的に扱うべきかも

const UserPublicPage: FC<{
  user: User
  predictions: Prediction[]
  targetDate: Date
}> = ({ user, predictions, targetDate }) => {
  const PublicSleepChartContainer = dynamic(
    () =>
      import('@/features/sleep/components/charts/PublicSleepChartContainer'),
    { ssr: false }
  )
  return (
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
            <PublicSleepChartContainer
              userId={user.id}
              predictions={predictions}
              targetDate={targetDate}
            />
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

export default UserPublicPage

import { FC } from 'react'
import dynamic from 'next/dynamic'
import {
  Avatar,
  Box,
  Container,
  Flex,
  HStack,
  Heading,
} from '@/components/chakra'
import { User } from '@/features/user/types/user'
import { Prediction } from '@/features/sleep/types/sleep'
import { DisplayMode } from '@/features/sleep/types/chart'
import ChartPageHeader from '@/components/ChartPageHeader'

// TODO テスタビリティ的にasyncなRSCはContainerコンポーネント的に扱うべきかも

const UserPublicPage: FC<{
  user: User
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}> = ({ user, predictions, targetDate, displayMode }) => {
  const PublicSleepChartContainer = dynamic(
    () =>
      import('@/features/sleep/components/charts/PublicSleepChartContainer'),
    { ssr: false }
  )
  return (
    <Flex as="main" direction="column" h="100%">
      <ChartPageHeader displayMode={displayMode} />
      <Container
        maxW="1000px"
        h="100%"
        px={{ base: 0, md: 4 }}
        pb={{ base: 0, md: 4 }}
        bg={{ base: 'contentBg', md: 'transparent' }}
      >
        <Flex direction="column" h="100%">
          <HStack
            px="4"
            pt={{ base: '2', md: '0' }}
            pb={{ base: '0', md: '3' }}
          >
            <Avatar
              name={user.nickname}
              src={user.avatarUrl ?? undefined}
              size={{ base: 'sm', md: 'md' }}
              background={user.avatarUrl ? 'unset' : undefined}
              ignoreFallback
            />
            <Heading size={{ base: 'sm', md: 'md' }}>
              {user && `${user.nickname}さんの睡眠予測`}
            </Heading>
          </HStack>
          <Box flex="1" minH="0">
            <PublicSleepChartContainer
              userId={user.id}
              predictions={predictions}
              targetDate={targetDate}
              displayMode={displayMode}
            />
          </Box>
        </Flex>
      </Container>
    </Flex>
  )
}

export default UserPublicPage

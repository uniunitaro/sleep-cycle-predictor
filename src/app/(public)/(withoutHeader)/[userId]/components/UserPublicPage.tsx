import { FC } from 'react'
import dynamic from 'next/dynamic'
import { Avatar, Box, Flex, HStack, Heading } from '@/components/chakra'
import { User } from '@/features/user/types/user'
import { Prediction } from '@/features/sleep/types/sleep'
import { DisplayMode } from '@/features/sleep/types/chart'
import ChartPageHeader from '@/components/ChartPageHeader'

const UserPublicPage: FC<{
  user: User
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}> = ({ user, predictions, targetDate, displayMode }) => {
  const SleepChartContainer = dynamic(
    () => import('@/features/sleep/components/charts/SleepChartContainer'),
    { ssr: false }
  )
  return (
    <Flex direction="column" h="100%">
      <ChartPageHeader displayMode={displayMode} />
      <Box flex="1" minH="0">
        <SleepChartContainer
          sleeps={[]}
          predictions={predictions}
          targetDate={targetDate}
          displayMode={displayMode}
          isPublic={true}
          userHeading={
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
          }
        />
      </Box>
    </Flex>
  )
}

export default UserPublicPage

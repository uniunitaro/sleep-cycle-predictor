import { FC } from 'react'
import { Container, Flex, Heading, Stack } from '@chakra-ui/react'
import SettingsHeader from '@/features/user/components/settings/SettingsHeader'
import { AuthUserWithConfig } from '@/features/user/types/user'
import NicknameForm from '@/features/user/components/settings/NicknameForm'
import EmailForm from '@/features/user/components/settings/EmailForm'
import PasswordForm from '@/features/user/components/settings/PasswordForm'
import SrcDurationSelect from '@/features/user/components/settings/SrcDurationSelect'
import DeleteAccount from '@/features/user/components/settings/DeleteAccount'
import { CardBodyMdOnly, CardMdOnly } from '@/components/MdOnlyCards'
import AvatarSetting from '@/features/user/components/settings/AvatarSetting'
import { SrcDuration } from '@/features/user/constants/predictionSrcDurations'
// import CalendarSetting from '@/features/user/components/settings/CalendarSetting'

const Settings: FC<{ userWithConfig: AuthUserWithConfig }> = ({
  userWithConfig,
}) => {
  return (
    <Flex direction="column" h="full">
      <SettingsHeader />
      <Container
        as="main"
        maxW="xl"
        h="full"
        minH="0"
        px="0"
        pb={{ base: 0, md: 4 }}
      >
        <CardMdOnly
          h="full"
          px={{ base: 6, md: 0 }}
          overflowY="auto"
          data-testid="scrollContainer"
        >
          <CardBodyMdOnly px={{ base: 0, md: 8 }}>
            <Stack spacing="16">
              <Stack spacing="5">
                <Heading as="h2" size="md">
                  プロフィール
                </Heading>
                <Stack spacing="4">
                  <AvatarSetting
                    nickname={userWithConfig.nickname}
                    srcUrl={userWithConfig.avatarUrl ?? undefined}
                  />
                  <NicknameForm nickname={userWithConfig.nickname} />
                  {userWithConfig.email && (
                    <EmailForm email={userWithConfig.email} />
                  )}
                  {userWithConfig.email && <PasswordForm />}
                </Stack>
              </Stack>
              <Stack spacing="5">
                <Heading as="h2" size="md">
                  睡眠予測
                </Heading>
                <Stack spacing="4">
                  <SrcDurationSelect
                    srcDuration={
                      userWithConfig.config.predictionSrcDuration as SrcDuration
                    }
                    srcStartDate={
                      userWithConfig.config.predictionSrcStartDate ?? undefined
                    }
                  />
                </Stack>
              </Stack>
              {/* <Stack spacing="5">
                <Heading as="h2" size="md">
                  外部カレンダー
                </Heading>
                <Stack spacing="4">
                  <CalendarSetting
                    calendars={userWithConfig.config.calendars}
                  />
                </Stack>
              </Stack> */}
              <Stack spacing="5">
                <Heading as="h2" size="md">
                  アカウントの削除
                </Heading>
                <Stack spacing="4">
                  <DeleteAccount />
                </Stack>
              </Stack>
            </Stack>
          </CardBodyMdOnly>
        </CardMdOnly>
      </Container>
    </Flex>
  )
}

export default Settings

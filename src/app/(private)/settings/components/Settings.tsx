import { FC } from 'react'
import SettingsHeader from '@/features/user/components/settings/SettingsHeader'
import { Container, Flex, Heading, Stack } from '@/components/chakra'
import { AuthUserWithConfig } from '@/features/user/types/user'
import NicknameForm from '@/features/user/components/settings/NicknameForm'
import EmailForm from '@/features/user/components/settings/EmailForm'
import PasswordForm from '@/features/user/components/settings/PasswordForm'
import SrcDurationSelect from '@/features/user/components/settings/SrcDurationSelect'
import DeleteAccount from '@/features/user/components/settings/DeleteAccount'
import { CardBodyMdOnly, CardMdOnly } from '@/components/MdOnlyCards'
import AvatarSetting from '@/features/user/components/settings/AvatarSetting'

const Settings: FC<{ userWithConfig: AuthUserWithConfig }> = ({
  userWithConfig,
}) => {
  return (
    <Flex direction="column" h="full" overflowY="auto">
      <SettingsHeader />
      <Container
        maxW="8xl"
        h="full"
        px={{ base: 0, md: 4 }}
        pb={{ base: 0, md: 4 }}
      >
        <Container maxW="xl" h="full">
          <CardMdOnly h="full">
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
                      srcDuration={userWithConfig.config.predictionSrcDuration}
                    />
                  </Stack>
                </Stack>
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
      </Container>
    </Flex>
  )
}

export default Settings

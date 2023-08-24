import { FC } from 'react'
import SettingsHeader from '@/features/user/components/settings/SettingsHeader'
import { Container, Flex, Heading, Stack } from '@/components/chakra'
import CardMdOnly from '@/components/MdOnlyCards/CardMdOnly/CardMdOnly'
import CardBodyMdOnly from '@/components/MdOnlyCards/CardBodyMdOnly'
import { AuthUserWithConfig } from '@/features/user/types/user'
import NicknameForm from '@/features/user/components/settings/NicknameForm'
import EmailForm from '@/features/user/components/settings/EmailForm'
import PasswordForm from '@/features/user/components/settings/PasswordForm'

const Settings: FC<{ userWithConfig: AuthUserWithConfig }> = ({
  userWithConfig,
}) => {
  return (
    <Flex direction="column" h="full">
      <SettingsHeader />
      <Container
        maxW="8xl"
        h="full"
        px={{ base: 0, md: 4 }}
        pb={{ base: 0, md: 4 }}
      >
        <Container maxW="2xl" h="full">
          <CardMdOnly h="full">
            <CardBodyMdOnly px={{ base: 0, md: 8 }}>
              <Heading as="h2" size="md" mb="5">
                プロフィール
              </Heading>
              <Stack spacing="5">
                <NicknameForm nickname={userWithConfig.nickname} />
                {userWithConfig.email && (
                  <EmailForm email={userWithConfig.email} />
                )}
                {userWithConfig.email && <PasswordForm />}
              </Stack>
            </CardBodyMdOnly>
          </CardMdOnly>
        </Container>
      </Container>
    </Flex>
  )
}

export default Settings

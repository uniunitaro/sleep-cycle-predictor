import { Metadata } from 'next'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { ogSettings } from '@/constants/og'
import { Box, Center, Text } from '@chakra-ui/react'
import {
  BasicCard,
  BasicCardBody,
  BasicCardLayout,
} from '@/components/BasicCards'
import Logo from '@/components/Logo/Logo'

const TITLE = 'パスワードのリセットを完了してください'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogSettings,
  },
}

const ConfirmPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')

  return (
    <Box as="main" h="full">
      <BasicCardLayout>
        <BasicCard>
          <BasicCardBody>
            <Center my="12">
              <Logo />
            </Center>
            <Center my="12">
              <Text fontWeight="bold">
                指定のメールアドレスにパスワードのリセットのためのメールを送信しました。
                メール内のリンクにアクセスし、パスワードを変更してください。
              </Text>
            </Center>
          </BasicCardBody>
        </BasicCard>
      </BasicCardLayout>
    </Box>
  )
}

export default ConfirmPage

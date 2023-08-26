'use client'

import { FC } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Stack,
} from '@/components/chakra'
import {
  BasicCard,
  BasicCardBody,
  BasicCardHeader,
  BasicCardLayout,
} from '@/components/BasicCards'
import GoogleLogo from '@/features/auth/components/GoogleLogo'
import { useErrorToast } from '@/hooks/useErrorToast'
import ProviderButton from '@/features/auth/components/ProviderButton'

const SignUp: FC = () => {
  const supabase = createClientComponentClient()
  const errorToast = useErrorToast()
  const router = useRouter()
  const handleGoogleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/api/auth/google?next=/home` },
    })
    if (error) {
      errorToast()
    } else {
      router.push('/home')
    }
  }

  return (
    <BasicCardLayout>
      <BasicCard>
        <BasicCardHeader>
          <Heading as="h1" size="md" textAlign="center">
            新規登録
          </Heading>
        </BasicCardHeader>
        <BasicCardBody>
          <Stack spacing="6">
            <ProviderButton
              leftIcon={<GoogleLogo />}
              onClick={handleGoogleSignUp}
            >
              Googleで登録
            </ProviderButton>
            <HStack>
              <Divider />
              <Box flexShrink="0" fontSize="sm">
                または
              </Box>
              <Divider />
            </HStack>
            <Button
              as={Link}
              href="/signup/with-email"
              colorScheme="green"
              w="full"
            >
              メールアドレスで登録
            </Button>
          </Stack>
        </BasicCardBody>
      </BasicCard>
    </BasicCardLayout>
  )
}

export default SignUp

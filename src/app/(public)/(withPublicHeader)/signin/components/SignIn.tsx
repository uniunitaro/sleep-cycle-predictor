'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Stack,
} from '@/components/chakra'
import PasswordField from '@/components/PasswordField/PasswordField'
import {
  BasicCard,
  BasicCardBody,
  BasicCardHeader,
  BasicCardLayout,
} from '@/components/BasicCards'
import ProviderButton from '@/features/auth/components/ProviderButton'
import GoogleLogo from '@/features/auth/components/GoogleLogo'
import { useErrorToast } from '@/hooks/useErrorToast'
import XLogo from '@/features/auth/components/XLogo'

type Schema = { email: string; password: string }

const SignIn: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<Schema>()

  const [error, setError] = useState<boolean>(false)

  const router = useRouter()
  const supabase = createClientComponentClient()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setError(true)
    } else {
      router.push('/home')
    }
  }

  const errorToast = useErrorToast()
  const handleProviderSignIn = async (provider: 'google' | 'twitter') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/api/auth/google?next=/home` },
    })
    if (error) {
      errorToast()
    }
  }

  return (
    <BasicCardLayout>
      <BasicCard>
        <BasicCardHeader>
          <Heading as="h1" size="md" textAlign="center">
            ログイン
          </Heading>
        </BasicCardHeader>
        <BasicCardBody>
          <Stack spacing="6">
            <ProviderButton
              leftIcon={<GoogleLogo />}
              onClick={() => handleProviderSignIn('google')}
            >
              Googleでログイン
            </ProviderButton>
            <ProviderButton
              leftIcon={<XLogo />}
              onClick={() => handleProviderSignIn('twitter')}
            >
              Xでログイン
            </ProviderButton>
            <HStack>
              <Divider />
              <Box flexShrink="0" fontSize="sm">
                または
              </Box>
              <Divider />
            </HStack>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing="10">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">メールアドレス</FormLabel>
                    <Input id="email" type="email" {...register('email')} />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">パスワード</FormLabel>
                    <PasswordField id="password" {...register('password')} />
                  </FormControl>
                </Stack>
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    メールアドレスまたはパスワードが間違っています。
                  </Alert>
                )}
                <Button
                  colorScheme="green"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  メールアドレスでログイン
                </Button>
              </Stack>
            </form>
          </Stack>
        </BasicCardBody>
      </BasicCard>
    </BasicCardLayout>
  )
}

export default SignIn

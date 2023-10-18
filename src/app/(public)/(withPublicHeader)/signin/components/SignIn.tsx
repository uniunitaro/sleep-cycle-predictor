'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Stack,
  Text,
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

const schema = z.object({
  email: z
    .string()
    .email({ message: 'メールアドレスの形式が正しくありません' }),
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .regex(
      /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
      'パスワードは英字と数字をどちらも含む必要があります'
    ),
})
type Schema = z.infer<typeof schema>

const SignIn: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<Schema>({ mode: 'onBlur', resolver: zodResolver(schema) })

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
      options: {
        redirectTo: `${location.origin}/api/auth/callback/oauth?next=/home`,
      },
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
              <Box flexShrink="0" fontSize="sm" aria-hidden>
                または
              </Box>
              <Box srOnly>メールアドレスとパスワードでログイン</Box>
              <Divider aria-hidden />
            </HStack>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing="10">
                <Stack spacing="5">
                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">メールアドレス</FormLabel>
                    <Input id="email" type="email" {...register('email')} />
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel htmlFor="password">パスワード</FormLabel>
                    <PasswordField id="password" {...register('password')} />
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
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
                <Text fontSize="sm" color="secondaryGray">
                  <Link href="/terms">利用規約</Link>、
                  <Link href="/privacy">プライバシーポリシー</Link>
                  に同意したうえでログインしてください。
                </Text>
              </Stack>
            </form>
          </Stack>
        </BasicCardBody>
      </BasicCard>
    </BasicCardLayout>
  )
}

export default SignIn

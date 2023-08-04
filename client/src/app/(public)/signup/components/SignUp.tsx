'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CreateUserRequest } from '@shared-types/users/users.dto'
import PasswordField from '@/components/PasswordField/PasswordField'
import { api } from '@/libs/axios'
import {
  Alert,
  AlertIcon,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@/components/chakra'
import AuthFormCard from '@/features/auth/components/AuthFormCard/AuthFormCard'
import { signUp } from '@/features/auth/server/signUp'

export const runtime = 'nodejs'

const schema = z.object({
  nickname: z.string().nonempty({ message: 'ニックネームを入力してください' }),
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

const SignUp: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({ mode: 'onBlur', resolver: zodResolver(schema) })

  const [error, setError] = useState<boolean>(false)

  const router = useRouter()
  const [, startTransition] = useTransition()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    startTransition(async () => {
      const { error } = await signUp({
        nickname: data.nickname,
        email: data.email,
        password: data.password,
      })
      if (error) {
        setError(true)
      } else {
        router.replace('/home')
      }
    })
  }

  return (
    <Container
      maxW="lg"
      py={{ base: '4', md: '8' }}
      px={{ base: '0', md: '8' }}
    >
      <AuthFormCard>
        <Stack spacing="7">
          <Heading size="lg" fontWeight="normal" textAlign="center">
            新規登録
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing="10">
              <Stack spacing="5">
                <FormControl isInvalid={!!errors.nickname}>
                  <FormLabel htmlFor="nickname">ニックネーム</FormLabel>
                  <Input id="nickname" {...register('nickname')} />
                  <FormErrorMessage>
                    {errors.nickname && errors.nickname.message}
                  </FormErrorMessage>
                </FormControl>
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
                  登録時にエラーが発生しました。
                </Alert>
              )}
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
              >
                登録する
              </Button>
            </Stack>
          </form>
        </Stack>
      </AuthFormCard>
    </Container>
  )
}

export default SignUp

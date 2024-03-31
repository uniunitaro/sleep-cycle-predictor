'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react'
import PasswordField from '@/components/PasswordField/PasswordField'
import { signUp } from '@/features/auth/server/signUp'
import {
  BasicCard,
  BasicCardBody,
  BasicCardHeader,
  BasicCardLayout,
} from '@/components/BasicCards'

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

const SignUpWithEmail: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({ mode: 'onBlur', resolver: zodResolver(schema) })

  const [error, setError] = useState<boolean>(false)

  const router = useRouter()
  const [isPending, startTransition] = useTransition()
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
        router.replace('/signup/with-email/confirm')
      }
    })
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
                  <PasswordField
                    id="password"
                    autoComplete="new-password"
                    {...register('password')}
                  />
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
              <Button colorScheme="green" type="submit" isLoading={isPending}>
                登録する
              </Button>
            </Stack>
          </form>
        </BasicCardBody>
      </BasicCard>
    </BasicCardLayout>
  )
}

export default SignUpWithEmail

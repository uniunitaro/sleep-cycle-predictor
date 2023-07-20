'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { FC, useState } from 'react'
import { getApp } from 'firebase/app'
import { useRouter } from 'next/navigation'
import {
  Alert,
  AlertIcon,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@/app/_components/chakra'
import PasswordField from '@/components/PasswordField/PasswordField'
import AuthFormCard from '@/features/auths/components/AuthFormCard/AuthFormCard'

type Schema = { email: string; password: string }

const SignIn: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<Schema>()

  const [error, setError] = useState<boolean>(false)

  const router = useRouter()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    const auth = getAuth(getApp())
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.push('/home')
    } catch (e) {
      setError(true)
    }
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
            ログイン
          </Heading>
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
                ログイン
              </Button>
            </Stack>
          </form>
        </Stack>
      </AuthFormCard>
    </Container>
  )
}

export default SignIn

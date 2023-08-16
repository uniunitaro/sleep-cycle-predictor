'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
} from '@/components/chakra'
import PasswordField from '@/components/PasswordField/PasswordField'
import AuthFormCard from '@/features/auth/components/AuthFormCard/AuthFormCard'

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
      return
    }
    router.push('/home')
  }

  return (
    <Container
      maxW="lg"
      py={{ base: '4', md: '8' }}
      px={{ base: '0', md: '8' }}
    >
      <AuthFormCard>
        <Stack spacing="7">
          <Heading as="h1" size="md" textAlign="center">
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

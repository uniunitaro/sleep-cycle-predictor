'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormLabel,
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
    <BasicCardLayout>
      <BasicCard>
        <BasicCardHeader>
          <Heading as="h1" size="md" textAlign="center">
            ログイン
          </Heading>
        </BasicCardHeader>
        <BasicCardBody>
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
        </BasicCardBody>
      </BasicCard>
    </BasicCardLayout>
  )
}

export default SignIn

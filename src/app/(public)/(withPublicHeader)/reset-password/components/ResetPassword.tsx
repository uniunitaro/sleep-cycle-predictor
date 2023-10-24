'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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
} from '@/components/chakra'
import {
  BasicCard,
  BasicCardBody,
  BasicCardHeader,
  BasicCardLayout,
} from '@/components/BasicCards'

const schema = z.object({
  email: z
    .string()
    .email({ message: 'メールアドレスの形式が正しくありません' }),
})
type Schema = z.infer<typeof schema>

const ResetPassword: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({ mode: 'onBlur', resolver: zodResolver(schema) })

  const [error, setError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()
  const supabase = createClientComponentClient()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setIsLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${location.origin}/api/auth/callback?next=/settings`,
    })
    if (error) {
      setIsLoading(false)
      setError(true)
    } else {
      router.replace('/reset-password/sent')
    }
  }

  return (
    <BasicCardLayout>
      <BasicCard>
        <BasicCardHeader>
          <Heading as="h1" size="md" textAlign="center">
            パスワードのリセット
          </Heading>
        </BasicCardHeader>
        <BasicCardBody>
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
              </Stack>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  エラーが発生しました。
                </Alert>
              )}
              <Button colorScheme="green" type="submit" isLoading={isLoading}>
                パスワードをリセットする
              </Button>
            </Stack>
          </form>
        </BasicCardBody>
      </BasicCard>
    </BasicCardLayout>
  )
}

export default ResetPassword

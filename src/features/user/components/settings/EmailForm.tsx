'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react'
import { updateAuthUser } from '../../repositories/users'
import FormButton from './FormButton'
import { useErrorToast } from '@/hooks/useErrorToast'

const schema = z.object({
  email: z
    .string()
    .email({ message: 'メールアドレスの形式が正しくありません' }),
})
type Schema = z.infer<typeof schema>

const EmailForm: FC<{ email: string }> = ({ email }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
  })

  const [hasEmailChanged, setHasEmailChanged] = useState(false)
  const [isPending, startTransition] = useTransition()
  const errorToast = useErrorToast()
  const toast = useToast()
  const supabase = createClientComponentClient()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setHasEmailChanged(false)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()
    if (sessionError || !session) {
      errorToast()
      return
    }
    const { error } = await supabase.auth.updateUser(
      { email: data.email },
      {
        emailRedirectTo: `${location.origin}/api/auth/callback?next=/email-updated?id=${session.user.id}`,
      }
    )
    if (error) {
      errorToast()
      return
    }

    startTransition(async () => {
      const { error } = await updateAuthUser({ newEmail: data.email })
      if (error) {
        errorToast()
        return
      }

      setHasEmailChanged(true)
      toast({
        title: (
          <>
            新しいメールアドレスに確認メールを送信しました。
            <br />
            メール内のリンクにアクセスすると変更が完了します。
          </>
        ),
        status: 'info',
        duration: 10000,
        isClosable: true,
      })
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Flex>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">メールアドレス</FormLabel>
          <Input
            id="email"
            type="email"
            placeholder={email}
            {...register('email')}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormButton
          aria-label="メールアドレスを変更する"
          type="submit"
          isSuccess={hasEmailChanged}
          isLoading={isSubmitting || isPending}
        >
          変更
        </FormButton>
      </Flex>
    </form>
  )
}

export default EmailForm

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import FormButton from './FormButton'
import {
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@/components/chakra'
import { useErrorToast } from '@/hooks/useErrorToast'
import PasswordField from '@/components/PasswordField/PasswordField'

const schema = z.object({
  password: z
    .string()
    .min(8, { message: 'パスワードは8文字以上で入力してください' })
    .regex(
      /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i,
      'パスワードは英字と数字をどちらも含む必要があります'
    ),
})
type schema = z.infer<typeof schema>

const PasswordForm: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<schema>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
  })

  const [isSubmitting, startTransition] = useTransition()
  const [hasPasswordChanged, setHasPasswordChanged] = useState(false)
  const errorToast = useErrorToast()
  const supabase = createClientComponentClient()
  const onSubmit: SubmitHandler<schema> = async (data) => {
    setHasPasswordChanged(false)
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })
      if (error) {
        errorToast()
      } else {
        setHasPasswordChanged(true)
      }
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">パスワード</FormLabel>
          <PasswordField id="password" {...register('password')} />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormButton
          type="submit"
          isSuccess={hasPasswordChanged}
          isLoading={isSubmitting}
        >
          変更
        </FormButton>
      </Flex>
    </form>
  )
}

export default PasswordForm

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState, useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateAuthUser } from '../../repositories/users'
import FormButton from './FormButton'
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useErrorToast } from '@/hooks/useErrorToast'

const schema = z.object({
  nickname: z.string().nonempty({ message: 'ニックネームを入力してください' }),
})
type Schema = z.infer<typeof schema>

const NicknameForm: FC<{ nickname: string }> = ({ nickname }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Schema>({
    mode: 'onSubmit',
    resolver: zodResolver(schema),
  })

  const [isSubmitting, startTransition] = useTransition()
  const [hasNicknameChanged, setHasNicknameChanged] = useState(false)
  const errorToast = useErrorToast()
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setHasNicknameChanged(false)
    startTransition(async () => {
      const { error } = await updateAuthUser({ nickname: data.nickname })
      if (error) {
        errorToast()
      } else {
        setHasNicknameChanged(true)
      }
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex>
        <FormControl isInvalid={!!errors.nickname}>
          <FormLabel htmlFor="nickname">ニックネーム</FormLabel>
          <Input
            id="nickname"
            placeholder={nickname}
            {...register('nickname')}
          />
          <FormErrorMessage>
            {errors.nickname && errors.nickname.message}
          </FormErrorMessage>
        </FormControl>
        <FormButton
          aria-label="ニックネームを変更する"
          type="submit"
          isSuccess={hasNicknameChanged}
          isLoading={isSubmitting}
        >
          変更
        </FormButton>
      </Flex>
    </form>
  )
}

export default NicknameForm

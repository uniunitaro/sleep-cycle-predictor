'use client'

import { FC, useState, useTransition } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { validateAndAddCalendar } from '../../server/validateAndAddCalendar'
import { deleteCalendar, updateCalendar } from '../../repositories/users'
import FormButton from './FormButton'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Stack,
  Text,
  UnorderedList,
  useToast,
} from '@/components/chakra'
import { Calendar } from '@/db/schema'
import { useErrorToast } from '@/hooks/useErrorToast'

const addSchema = z.object({
  url: z.string().url({ message: 'URLの形式が正しくありません' }),
})
type AddSchema = z.infer<typeof addSchema>

const CalendarSetting: FC<{ calendars: Calendar[] }> = ({ calendars }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AddSchema>({
    mode: 'onBlur',
    resolver: zodResolver(addSchema),
  })

  const [isPending, startTransition] = useTransition()
  const errorToast = useErrorToast()
  const toast = useToast()
  const onSubmit: SubmitHandler<AddSchema> = async (data) => {
    const isDuplicate = calendars.some((calendar) => calendar.url === data.url)
    if (isDuplicate) {
      toast({
        title: 'カレンダーはすでに追加されています。',
        status: 'warning',
        isClosable: true,
      })
      return
    }

    startTransition(async () => {
      const { error } = await validateAndAddCalendar(data.url)
      if (error) {
        errorToast()
        return
      }

      toast({
        title: 'カレンダーを追加しました。',
        status: 'success',
        isClosable: true,
      })
    })
  }

  return (
    <Stack spacing="12">
      <Stack spacing="4">
        <Heading as="h3" fontSize="md" color="secondaryGray">
          追加済みのカレンダー
        </Heading>
        {calendars.length ? (
          <UnorderedList m="0" listStyleType="none" spacing="9">
            {calendars.map((calendar) => (
              <ListItem key={calendar.id}>
                <CalendarListItem calendar={calendar} />
              </ListItem>
            ))}
          </UnorderedList>
        ) : (
          <Text fontSize="sm" color="secondaryGray">
            カレンダーはありません。
          </Text>
        )}
      </Stack>
      <Stack spacing="4">
        <Heading as="h3" fontSize="md" color="secondaryGray">
          新しいカレンダーを追加
        </Heading>
        <Stack spacing="3">
          <Text fontSize="sm" color="secondaryGray">
            iCal形式のカレンダーをURLを使って追加できます。
          </Text>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Flex>
              <FormControl isInvalid={!!errors.url}>
                <FormLabel>カレンダーのURL</FormLabel>
                <Input type="url" {...register('url')} />
                <FormErrorMessage>
                  {errors.url && errors.url.message}
                </FormErrorMessage>
              </FormControl>
              <FormButton
                aria-label="カレンダーを追加する"
                type="submit"
                // isSuccess={hasEmailChanged}
                isLoading={isSubmitting || isPending}
              >
                追加
              </FormButton>
            </Flex>
          </form>
        </Stack>
      </Stack>
    </Stack>
  )
}

const updateSchema = z.object({
  name: z.string().nonempty({ message: '名前を入力してください' }),
})
type UpdateSchema = z.infer<typeof updateSchema>

const CalendarListItem: FC<{
  calendar: Calendar
}> = ({ calendar }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSchema>({
    mode: 'onBlur',
    resolver: zodResolver(updateSchema),
  })

  const [hasNameChanged, setHasNameChanged] = useState(false)
  const [isPending, startTransition] = useTransition()
  const errorToast = useErrorToast()
  const onSubmit: SubmitHandler<UpdateSchema> = async (data) => {
    setHasNameChanged(false)

    startTransition(async () => {
      const { error } = await updateCalendar({
        id: calendar.id,
        newCalendar: { name: data.name },
      })
      if (error) {
        errorToast()
        return
      }

      setHasNameChanged(true)
    })
  }

  const [isDeleting, startDeleteTransition] = useTransition()
  const handleDelete = async () => {
    startDeleteTransition(async () => {
      const { error } = await deleteCalendar(calendar.id)
      if (error) {
        errorToast()
        return
      }
    })
  }

  return (
    <Stack spacing="2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>名前</FormLabel>
            <Input
              type="text"
              defaultValue={calendar.name}
              {...register('name')}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormButton
            aria-label="カレンダーの名前を変更する"
            type="submit"
            isSuccess={hasNameChanged}
            isLoading={isSubmitting || isPending}
          >
            変更
          </FormButton>
        </Flex>
      </form>
      <Text fontSize="sm">{calendar.url}</Text>
      <Box>
        <Button
          colorScheme="brand"
          variant="outline"
          size="sm"
          isLoading={isDeleting}
          onClick={handleDelete}
        >
          削除する
        </Button>
      </Box>
    </Stack>
  )
}

export default CalendarSetting

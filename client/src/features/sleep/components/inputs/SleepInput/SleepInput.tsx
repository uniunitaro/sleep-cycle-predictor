'use client'

import { FC, useState, useTransition } from 'react'
import { isBefore } from 'date-fns'
import SleepInputForm from '../SleepInputForm/SleepInputForm'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
} from '@/components/chakra'
import { addSleep } from '@/features/sleep/repositories/sleeps'

const SleepInput: FC = () => {
  const [sleeps, setSleeps] = useState([
    { start: new Date(), end: new Date(), id: 1 },
  ])

  const [isLoading, startTransition] = useTransition()
  const handleSubmit = () => {
    // TODO アラート追加
    // if (!isBefore(start, end)) return
    startTransition(async () => {
      await addSleep(sleeps.map((sleep) => ({ ...sleep, id: undefined })))
    })
  }

  return (
    <Card overflowY="auto">
      <CardHeader>
        <Heading size="md" fontWeight="normal">
          睡眠記録を追加
        </Heading>
      </CardHeader>
      <CardBody>
        <form>
          <Stack spacing="10">
            <SleepInputForm sleeps={sleeps} onChange={setSleeps} />
            <Button
              colorScheme="green"
              type="button"
              isLoading={isLoading}
              onClick={handleSubmit}
            >
              追加する
            </Button>
          </Stack>
        </form>
      </CardBody>
    </Card>
  )
}

export default SleepInput

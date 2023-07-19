import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
} from '@chakra-ui/react'
import { FC, useState } from 'react'
import { isBefore } from 'date-fns'
import { useCreateSleep } from '../../../apis/useSleeps'
import SleepInputForm from '../SleepInputForm/SleepInputForm'

const SleepInput: FC = () => {
  const [sleeps, setSleeps] = useState([
    { start: new Date(), end: new Date(), id: 1 },
  ])

  const { mutate: createSleep, isLoading } = useCreateSleep()

  const handleSubmit = () => {
    // TODO アラート追加
    // if (!isBefore(start, end)) return

    createSleep({
      sleeps: sleeps.map((sleep) => ({ ...sleep, id: undefined })),
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

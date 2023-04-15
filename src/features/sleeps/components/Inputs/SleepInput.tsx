import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { isBefore } from 'date-fns'
import { useCreateSleep } from '../../apis/useSleeps'
import DateAndTimeInput from './DateAndTimeInput'

const SleepInput = () => {
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())

  const { mutate: createSleep, isLoading } = useCreateSleep()

  const handleSubmit = () => {
    // TODO アラート追加
    if (!isBefore(start, end)) return

    createSleep({ start, end })
  }

  return (
    <Card>
      <CardHeader>睡眠記録を追加</CardHeader>
      <CardBody>
        <form>
          <Stack spacing="10">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="sleep-start">就寝日時</FormLabel>
                <DateAndTimeInput value={start} onChange={setStart} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="sleep-end">起床日時</FormLabel>
                <DateAndTimeInput value={end} onChange={setEnd} />
              </FormControl>
            </Stack>
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

import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
} from '@chakra-ui/react'
import { FC, useState } from 'react'
import { isBefore } from 'date-fns'
import { useCreateSleep } from '../../../apis/useSleeps'
import DateAndTimeInput from '../DateAndTimeInput/DateAndTimeInput'

const SleepInputModal: FC<Omit<ModalProps, 'children'>> = (props) => {
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())

  const { mutate: createSleep, isLoading } = useCreateSleep()

  const handleSubmit = () => {
    // TODO アラート追加
    if (!isBefore(start, end)) return

    createSleep({ sleeps: [{ start, end }] })
  }

  const handleClickAddWithClose = () => {
    handleSubmit()
    props.onClose()
  }

  return (
    <Modal autoFocus={false} isCentered {...props}>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>睡眠記録を追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter pt="7">
          <ButtonGroup>
            <Button
              colorScheme="green"
              variant="outline"
              isLoading={isLoading}
              onClick={handleSubmit}
              flex="1"
            >
              続けて入力
            </Button>
            <Button
              colorScheme="green"
              onClick={handleClickAddWithClose}
              flex="1"
            >
              追加する
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SleepInputModal

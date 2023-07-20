'use client'

import { FC, useState } from 'react'
import { isBefore } from 'date-fns'
import { useCreateSleep } from '../../../apis/useSleeps'
import SleepInputForm from '../SleepInputForm/SleepInputForm'
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from '@/app/_components/chakra'

const SleepInputModal: FC<Omit<ModalProps, 'children'>> = (props) => {
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

  const handleClickAddWithClose = () => {
    handleSubmit()
    props.onClose()
  }

  return (
    <Modal autoFocus={false} isCentered scrollBehavior="inside" {...props}>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>睡眠記録を追加</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <SleepInputForm sleeps={sleeps} onChange={setSleeps} />
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

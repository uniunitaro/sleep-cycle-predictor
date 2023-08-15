'use client'

import { forwardRef, useTransition } from 'react'
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
} from '@/components/chakra'
import { deleteSleep } from '@/features/sleep/repositories/sleeps'
import { Sleep } from '@/features/sleep/types/sleep'

type Props = Omit<ModalProps, 'children'> & { sleep: Sleep }
const SleepDeleteModal = forwardRef<HTMLDivElement, Props>(
  ({ sleep, ...modalProps }, ref) => {
    const [isLoading, startTransition] = useTransition()
    const handleSubmit = () => {
      startTransition(async () => {
        await deleteSleep(sleep.id)
        modalProps.onClose()
      })
    }

    return (
      <Modal autoFocus={false} isCentered {...modalProps}>
        <ModalOverlay />
        <ModalContent mx="4" ref={ref}>
          <ModalHeader>睡眠記録を削除</ModalHeader>
          <ModalCloseButton />
          <ModalBody>この睡眠記録を削除しますか？</ModalBody>
          <ModalFooter pt="7">
            <ButtonGroup>
              <Button
                colorScheme="green"
                variant="ghost"
                onClick={modalProps.onClose}
                flex="1"
              >
                キャンセル
              </Button>
              <Button
                colorScheme="red"
                isLoading={isLoading}
                onClick={handleSubmit}
                flex="1"
              >
                削除する
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)

SleepDeleteModal.displayName = 'SleepInputModal'

export default SleepDeleteModal

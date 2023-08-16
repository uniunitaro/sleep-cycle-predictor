'use client'

import { forwardRef, useRef, useTransition } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
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
    const cancelRef = useRef<HTMLButtonElement>(null)
    return (
      <AlertDialog leastDestructiveRef={cancelRef} isCentered {...modalProps}>
        <AlertDialogOverlay />
        <AlertDialogContent mx="4" ref={ref}>
          <AlertDialogHeader>睡眠記録を削除</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>この睡眠記録を削除しますか？</AlertDialogBody>
          <AlertDialogFooter pt="7">
            <ButtonGroup>
              <Button
                ref={cancelRef}
                color="secondaryGray"
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
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
)

SleepDeleteModal.displayName = 'SleepInputModal'

export default SleepDeleteModal

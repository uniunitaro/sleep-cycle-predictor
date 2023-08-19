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
  Hide,
  ModalProps,
  Show,
} from '@/components/chakra'
import { deleteSleep } from '@/features/sleep/repositories/sleeps'
import { Sleep } from '@/features/sleep/types/sleep'
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
} from '@/components/BottomSheet/BottomSheet'
import { useNextTick } from '@/hooks/useNextTick'

type Props = Omit<ModalProps, 'children'> & { sleep: Sleep }
const SleepDeleteModal = forwardRef<HTMLDivElement, Props>(
  ({ sleep, ...modalProps }, ref) => {
    const [isLoading, startTransition] = useTransition()
    const nextTick = useNextTick()
    const handleSubmit = () => {
      startTransition(async () => {
        await deleteSleep(sleep.id)

        nextTick(() => {
          modalProps.onClose()
        })
      })
    }
    const cancelRef = useRef<HTMLButtonElement>(null)
    return (
      <>
        <Show above="md">
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isCentered
            {...modalProps}
          >
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
        </Show>
        <Hide above="md">
          <BottomSheet
            isOpen={modalProps.isOpen}
            onClose={modalProps.onClose}
            autoFocus={false}
          >
            <BottomSheetHeader>睡眠記録を削除</BottomSheetHeader>
            <BottomSheetBody>この睡眠記録を削除しますか？</BottomSheetBody>
            <BottomSheetFooter>
              <ButtonGroup>
                <Button
                  variant="ghost"
                  color="secondaryGray"
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
            </BottomSheetFooter>
          </BottomSheet>
        </Hide>
      </>
    )
  }
)

SleepDeleteModal.displayName = 'SleepInputModal'

export default SleepDeleteModal

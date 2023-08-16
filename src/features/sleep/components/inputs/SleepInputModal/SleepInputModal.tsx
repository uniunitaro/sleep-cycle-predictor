'use client'

import {
  ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { isBefore } from 'date-fns'
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
} from '@/components/chakra'
import { addSleep, updateSleep } from '@/features/sleep/repositories/sleeps'
import { Sleep } from '@/features/sleep/types/sleep'

type SleepInputType = ComponentProps<typeof SleepInputForm>['sleeps']
type Props = Omit<ModalProps, 'children'> & { originalSleep?: Sleep }
const SleepInputModal = forwardRef<HTMLDivElement, Props>(
  ({ originalSleep, ...modalProps }, ref) => {
    const isUpdate = !!originalSleep
    const initSleeps = useCallback(
      (): SleepInputType =>
        isUpdate
          ? originalSleep.sleeps.map((sleep, i) => ({ ...sleep, id: i + 1 }))
          : [{ start: new Date(), end: new Date(), id: 1 }],
      [isUpdate, originalSleep]
    )
    const [sleeps, setSleeps] = useState<SleepInputType>(initSleeps())

    useEffect(() => {
      if (!modalProps.isOpen) {
        setSleeps(initSleeps())
      }
    }, [initSleeps, modalProps.isOpen])

    const [isLoading, startTransition] = useTransition()
    const handleSubmit = () => {
      // TODO アラート追加
      // if (!isBefore(start, end)) return
      startTransition(async () => {
        isUpdate
          ? await updateSleep(
              originalSleep.id,
              sleeps.map((sleep) => ({ ...sleep, id: undefined }))
            )
          : await addSleep(sleeps.map((sleep) => ({ ...sleep, id: undefined })))
        modalProps.onClose()
      })
    }

    return (
      <Modal isCentered {...modalProps}>
        <ModalOverlay />
        <ModalContent mx="4" ref={ref}>
          <ModalHeader>
            {isUpdate ? '睡眠記録を編集' : '睡眠記録を追加'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
              <SleepInputForm sleeps={sleeps} onChange={setSleeps} />
            </form>
          </ModalBody>
          <ModalFooter pt="7">
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
                colorScheme="green"
                isLoading={isLoading}
                onClick={handleSubmit}
                flex="1"
              >
                {isUpdate ? '更新する' : '追加する'}
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)

SleepInputModal.displayName = 'SleepInputModal'

export default SleepInputModal

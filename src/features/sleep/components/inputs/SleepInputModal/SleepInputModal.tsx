'use client'

import {
  ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { setMilliseconds, setMinutes, setSeconds, subHours } from 'date-fns'
import SleepInputForm from '../SleepInputForm/SleepInputForm'
import {
  Alert,
  AlertIcon,
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
  Stack,
  useBreakpointValue,
} from '@/components/chakra'
import { addSleep, updateSleep } from '@/features/sleep/repositories/sleeps'
import { Sleep } from '@/features/sleep/types/sleep'

type SleepInputType = ComponentProps<typeof SleepInputForm>['sleeps']
type Props = Omit<ModalProps, 'children'> & { originalSleep?: Sleep }
const SleepInputModal = forwardRef<HTMLDivElement, Props>(
  ({ originalSleep, ...modalProps }, ref) => {
    const isUpdate = !!originalSleep
    const initSleeps = useCallback((): SleepInputType => {
      const initialDate = () =>
        setMilliseconds(setSeconds(setMinutes(new Date(), 0), 0), 0)

      return isUpdate
        ? originalSleep.sleeps.map((sleep, i) => ({ ...sleep, id: i + 1 }))
        : [{ start: subHours(initialDate(), 8), end: initialDate(), id: 1 }]
    }, [isUpdate, originalSleep])

    const [sleeps, setSleeps] = useState<SleepInputType>(initSleeps())

    useEffect(() => {
      if (modalProps.isOpen) {
        setSleeps(initSleeps())
        setError(undefined)
      }
    }, [initSleeps, modalProps.isOpen])

    const [error, setError] = useState<string>()
    const [isLoading, startTransition] = useTransition()
    const handleSubmit = () => {
      setError(undefined)

      startTransition(async () => {
        const { error: serverError } = isUpdate
          ? await updateSleep(
              originalSleep.id,
              sleeps.map((sleep) => ({ ...sleep, id: undefined }))
            )
          : await addSleep(sleeps.map((sleep) => ({ ...sleep, id: undefined })))

        if (serverError) {
          if (serverError === true) {
            setError('エラーが発生しました。')
          } else if (serverError.type === 'overlapInRequest') {
            setError('睡眠記録が重複しています。')
          } else if (serverError.type === 'overlapWithRecorded') {
            setError('すでに記録されている睡眠記録と重複しています。')
          }
        } else {
          modalProps.onClose()
        }
      })
    }

    const isMobile = useBreakpointValue({ base: true, md: false })

    return (
      <Modal
        isCentered
        scrollBehavior={isMobile ? 'inside' : 'outside'}
        size="sm"
        {...modalProps}
      >
        <ModalOverlay />
        <ModalContent mx="4" ref={ref}>
          <ModalHeader>
            {isUpdate ? '睡眠記録を編集' : '睡眠記録を追加'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="5">
              <form>
                <SleepInputForm sleeps={sleeps} onChange={setSleeps} />
              </form>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter pt="7">
            <ButtonGroup>
              <Button
                variant="ghost"
                color="secondaryGray"
                onClick={modalProps.onClose}
              >
                キャンセル
              </Button>
              <Button
                colorScheme="green"
                isLoading={isLoading}
                onClick={handleSubmit}
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

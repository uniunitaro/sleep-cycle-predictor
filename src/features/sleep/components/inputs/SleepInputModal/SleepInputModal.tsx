'use client'

import {
  ComponentProps,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'
import {
  isAfter,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subHours,
} from 'date-fns'
import SleepInputForm from '../SleepInputForm/SleepInputForm'
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  Text,
  useBreakpointValue,
  useDisclosure,
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
    const handleSubmit = (args?: { ignoreShortInterval?: boolean }) => {
      setError(undefined)

      const isAfterToday = sleeps.some((sleep) =>
        isAfter(sleep.end, new Date())
      )
      if (isAfterToday) {
        setError('未来の日付を指定することはできません。')
        return
      }

      startTransition(async () => {
        const { error: serverError } = isUpdate
          ? await updateSleep({
              id: originalSleep.id,
              sleeps: sleeps.map((sleep) => ({ ...sleep, id: undefined })),
              ignoreShortInterval: args?.ignoreShortInterval,
            })
          : await addSleep({
              sleeps: sleeps.map((sleep) => ({ ...sleep, id: undefined })),
              ignoreShortInterval: args?.ignoreShortInterval,
            })

        if (serverError) {
          if (serverError === true) {
            setError('エラーが発生しました。')
          } else if (serverError.type === 'overlapInRequest') {
            setError('睡眠記録が重複しています。')
          } else if (serverError.type === 'overlapWithRecorded') {
            setError('すでに記録されている睡眠記録と重複しています。')
          } else if (serverError.type === 'shortInterval') {
            onOpen()
          }
        } else {
          onClose()
          modalProps.onClose()
        }
      })
    }

    const isMobile = useBreakpointValue({ base: true, md: false })

    const { isOpen, onClose, onOpen } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)

    return (
      <>
        <Modal
          isCentered
          scrollBehavior={isMobile ? 'inside' : 'outside'}
          size="sm"
          {...modalProps}
        >
          <ModalOverlay />
          <ModalContent mx="4" minWidth={300} ref={ref}>
            <ModalHeader>
              {isUpdate ? '睡眠記録を編集' : '睡眠記録を追加'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing="5">
                <SleepInputForm sleeps={sleeps} onChange={setSleeps} />
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
                  onClick={() => handleSubmit()}
                >
                  {isUpdate ? '更新する' : '追加する'}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog
          isCentered
          size="sm"
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
          closeOnEsc={false}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay />
          <AlertDialogContent mx="4" minWidth={300} ref={ref}>
            <AlertDialogHeader>睡眠の間隔が短いです</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              <Stack>
                <Text>
                  {isUpdate ? '更新' : '追加'}
                  しようとしている睡眠の前後8時間以内に別の睡眠が存在します。
                </Text>
                <Text>
                  正確な睡眠予測のためには、一日の睡眠記録は一つである必要があります。
                </Text>
                <Text>
                  もし、{isUpdate ? '更新' : '追加'}
                  しようとしている睡眠が昼寝や分割睡眠であれば、すでに記録されている睡眠に「分割睡眠」として追加することをおすすめします。
                </Text>
                <Text>
                  このまま{isUpdate ? '更新' : '追加'}する場合は、「
                  {isUpdate ? '更新する' : '追加する'}
                  」ボタンを押してください。
                </Text>
              </Stack>
            </AlertDialogBody>
            <AlertDialogFooter pt="7">
              <ButtonGroup>
                <Button ref={cancelRef} colorScheme="green" onClick={onClose}>
                  キャンセル
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="green"
                  isLoading={isLoading}
                  onClick={() => handleSubmit({ ignoreShortInterval: true })}
                >
                  {isUpdate ? '更新する' : '追加する'}
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }
)

SleepInputModal.displayName = 'SleepInputModal'

export default SleepInputModal

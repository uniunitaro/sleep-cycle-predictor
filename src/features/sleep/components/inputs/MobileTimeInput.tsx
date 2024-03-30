import { FC, memo, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { MdOutlineKeyboard } from 'react-icons/md'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { useTimeInput } from '../../hooks/useTimeInput'
import TimePicker from './TimePicker/TimePicker'
import HourMinuteInput from './HourMinuteInput/HourMinuteInput'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'

type Props = {
  value: Date
  ariaLabel?: string
  onChange: (value: Date) => void
}
const MobileTimeInput: FC<Props> = memo(({ value, ariaLabel, onChange }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [inputMode, setInputMode] = useState<'clock' | 'keyboard'>(
    (localStorage.getItem('timeInputMode') as 'clock' | 'keyboard') ?? 'clock'
  )
  useEffect(() => {
    if (inputMode === 'keyboard') {
      hourRef.current?.focus()
    }
  }, [inputMode])

  const handleOpen = () => {
    setInputMode(
      (localStorage.getItem('timeInputMode') as 'clock' | 'keyboard') ?? 'clock'
    )
    onOpen()
  }

  const formatted = format(value, 'HH:mm')
  const [inputValue, setInputValue] = useState(formatted)

  const [timeValueInModal, setTimeValueInModal] = useState(value)
  const handleChangeTimePicker = (date: Date) => {
    setTimeValueInModal(date)
  }

  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  const {
    hour,
    minute,
    setHour,
    setMinute,
    handleChangeHour,
    handleChangeMinute,
    setAndReturnValidTime,
  } = useTimeInput({ date: timeValueInModal, hourRef, minuteRef })

  const handleBlurTime = () => {
    const parsedDate = setAndReturnValidTime()
    if (parsedDate) {
      setTimeValueInModal(parsedDate)
    }
  }

  const handleConfirmOnKeyboard = () => {
    const parsedDate = setAndReturnValidTime()
    if (!parsedDate) return

    onChange(parsedDate)
    setInputValue(format(parsedDate, 'HH:mm'))
    onClose()
  }

  const handleConfirmOnClock = () => {
    onChange(timeValueInModal)
    setInputValue(format(timeValueInModal, 'HH:mm'))
    onClose()
  }

  const switchButtonRef = useRef<HTMLButtonElement>(null)

  const switchInputMode = (mode: 'clock' | 'keyboard') => {
    setHour(format(timeValueInModal, 'HH'))
    setMinute(format(timeValueInModal, 'mm'))

    localStorage.setItem('timeInputMode', mode)
    setInputMode(mode)
  }

  return (
    <>
      <Box
        role="button"
        aria-label={(ariaLabel ?? '時間') + ' ' + inputValue}
        onClick={handleOpen}
        onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
        tabIndex={0}
      >
        <Input
          value={inputValue}
          tabIndex={-1}
          id=""
          isReadOnly
          aria-hidden
          _focusVisible={{}}
        />
      </Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        initialFocusRef={inputMode === 'clock' ? switchButtonRef : hourRef}
      >
        <ModalOverlay />
        <ModalContent w={300}>
          <ModalBody pt="8">
            {inputMode === 'clock' ? (
              <TimePicker
                value={timeValueInModal}
                onChange={handleChangeTimePicker}
              />
            ) : (
              <Center>
                <HourMinuteInput
                  ref={hourRef}
                  value={hour}
                  id=""
                  aria-label="時間を入力"
                  onChange={handleChangeHour}
                  onBlur={handleBlurTime}
                  onFocus={() => setHour('')}
                />
                <Center width="4" fontSize="2xl" fontWeight="bold" aria-hidden>
                  :
                </Center>
                <HourMinuteInput
                  ref={minuteRef}
                  value={minute}
                  id=""
                  aria-label="分を入力"
                  onChange={handleChangeMinute}
                  onBlur={handleBlurTime}
                  onFocus={() => setMinute('')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmOnKeyboard()
                    }
                  }}
                />
              </Center>
            )}
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <IconButton
              ref={switchButtonRef}
              icon={
                <Icon
                  as={
                    inputMode === 'clock'
                      ? MdOutlineKeyboard
                      : AiOutlineClockCircle
                  }
                  boxSize="5"
                  color="secondaryGray"
                />
              }
              aria-label={
                inputMode === 'clock'
                  ? 'キーボードで時刻を入力する'
                  : '時計で時刻を入力する'
              }
              variant="ghost"
              onClick={() =>
                switchInputMode(inputMode === 'clock' ? 'keyboard' : 'clock')
              }
            />
            <ButtonGroup>
              <Button variant="ghost" color="secondaryGray" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                variant="ghost"
                colorScheme="green"
                onClick={
                  inputMode === 'clock'
                    ? handleConfirmOnClock
                    : handleConfirmOnKeyboard
                }
              >
                OK
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
})

MobileTimeInput.displayName = 'MobileTimeInput'

export default MobileTimeInput

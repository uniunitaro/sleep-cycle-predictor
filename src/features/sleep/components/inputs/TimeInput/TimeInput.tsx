'use client'

import { format, isValid, parse } from 'date-fns'
import { FC, memo, useRef, useState } from 'react'
import TimePicker from '../TimePicker/TimePicker'
import {
  Button,
  ButtonGroup,
  Hide,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Show,
  useDisclosure,
  useOutsideClick,
} from '@/components/chakra'

type Props = {
  value: Date
  onChange: (value: Date) => void
} & Omit<InputProps, 'value' | 'onChange'>

const TimeInput: FC<Props> = memo(({ value, onChange, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const popoverContentRef = useRef<HTMLElement>(null)
  useOutsideClick({
    ref: popoverContentRef,
    handler: () => {
      if (
        popoverContentRef.current &&
        inputRef.current !== document.activeElement
      ) {
        onClose()
      }
    },
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const formatted = format(value, 'HH:mm')
  const [inputValue, setInputValue] = useState(formatted)
  const [oldValue, setOldValue] = useState(value)

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlurDate = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsedDate = parse(e.target.value, 'HH:mm', new Date())
    if (!isValid(parsedDate)) {
      setInputValue(format(oldValue, 'HH:mm'))
      return
    }

    onChange(parsedDate)

    setOldValue(parsedDate)
    setTimePickerValue(parsedDate)
  }

  const [timePickerValue, setTimePickerValue] = useState(value)
  const handleChangeTimePicker = (date: Date) => {
    setTimePickerValue(date)
  }

  const handleConfirmTimePicker = () => {
    onChange(timePickerValue)
    setInputValue(format(timePickerValue, 'HH:mm'))
    setOldValue(timePickerValue)
    onClose()
  }

  const timeInput = (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={handleChangeDate}
      onBlur={handleBlurDate}
      onFocus={onOpen}
      {...rest}
    />
  )
  return (
    <>
      <Show above="md">
        <Popover
          isOpen={isOpen}
          placement="bottom-start"
          initialFocusRef={inputRef}
        >
          <PopoverAnchor>{timeInput}</PopoverAnchor>
          <Show above="md">
            <PopoverContent ref={popoverContentRef} w="auto"></PopoverContent>
          </Show>
        </Popover>
      </Show>
      <Hide above="md">
        {timeInput}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          returnFocusOnClose={false}
          isCentered
        >
          <ModalOverlay />
          <ModalContent w={300}>
            <ModalBody pt="8">
              <TimePicker
                value={timePickerValue}
                onChange={handleChangeTimePicker}
              />
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button variant="ghost" color="secondaryGray" onClick={onClose}>
                  キャンセル
                </Button>
                <Button
                  variant="ghost"
                  colorScheme="green"
                  onClick={handleConfirmTimePicker}
                >
                  OK
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Hide>
    </>
  )
})

TimeInput.displayName = 'TimeInput'
export default TimeInput

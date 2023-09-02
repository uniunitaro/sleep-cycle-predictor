'use client'

import { format, isValid, parse } from 'date-fns'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import DatePickerWrapper from '../DatePickerWrapper'
import {
  Hide,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  Show,
  useDisclosure,
  useOutsideClick,
} from '@/components/chakra'

type Props = {
  value: Date
  onChange: (value: Date) => void
} & Omit<InputProps, 'value' | 'onChange'>

const DateInput: FC<Props> = memo(({ value, onChange, ...rest }) => {
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

  const handleCloseModal = () => {
    onClose()
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const formatted = format(value, 'yyyy/MM/dd')
  const [inputValue, setInputValue] = useState(formatted)
  const [oldInputValue, setOldInputValue] = useState(inputValue)
  useEffect(() => {
    setInputValue(formatted)
    setOldInputValue(formatted)
  }, [formatted])

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlurDate = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsedDate = parse(e.target.value, 'yyyy/MM/dd', new Date())
    if (!isValid(parsedDate)) {
      setInputValue(oldInputValue)
      return
    }

    onChange(parsedDate)

    const formatted = format(parsedDate, 'yyyy/MM/dd')
    setOldInputValue(formatted)
  }

  const handleClickDate = useCallback(
    (date: string) => {
      onChange(new Date(date))

      const formatted = format(new Date(date), 'yyyy/MM/dd')
      setInputValue(formatted)
      setOldInputValue(formatted)
      onClose()
    },
    [onChange, onClose]
  )

  const dateInput = (
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
          isLazy
        >
          <PopoverAnchor>{dateInput}</PopoverAnchor>
          <Show above="md">
            <PopoverContent ref={popoverContentRef} w="auto">
              <PopoverBody p="0">
                <DatePickerWrapper
                  value={oldInputValue}
                  colorScheme="green"
                  onChange={handleClickDate}
                />
              </PopoverBody>
            </PopoverContent>
          </Show>
        </Popover>
      </Show>
      <Hide above="md">
        {dateInput}
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          returnFocusOnClose={false}
          isCentered
        >
          <ModalOverlay />
          <ModalContent w={300}>
            <ModalBody p="0">
              <DatePickerWrapper
                value={oldInputValue}
                colorScheme="green"
                onChange={handleClickDate}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hide>
    </>
  )
})

DateInput.displayName = 'DateInput'
export default DateInput

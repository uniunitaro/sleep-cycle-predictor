'use client'

import { format, isValid, parse } from 'date-fns'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { DateValue, parseDate } from '@internationalized/date'
import {
  Box,
  Button,
  Hide,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  Show,
  useDisclosure,
  useOutsideClick,
} from '@/components/chakra'
import DatePicker from '@/components/DatePicker'

type Props = {
  value: Date
  id?: string
  ariaLabel?: string
  onChange: (value: Date) => void
}

const DateInput: FC<Props> = memo(({ value, id, ariaLabel, onChange }) => {
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
    // キーボードによるフォーカス移動の場合に閉じる
    if (
      popoverContentRef.current &&
      !popoverContentRef.current.contains(e.relatedTarget)
    ) {
      onClose()
    }

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
    (details: { value: DateValue[] }) => {
      const date = details.value[0].toDate(
        Intl.DateTimeFormat().resolvedOptions().timeZone
      )

      onChange(date)

      const formatted = format(date, 'yyyy/MM/dd')
      setInputValue(formatted)
      setOldInputValue(formatted)
      onClose()
    },
    [onChange, onClose]
  )

  return (
    <>
      <Show above="md">
        <Popover
          isOpen={isOpen}
          placement="bottom-start"
          autoFocus={false}
          returnFocusOnClose={false}
          isLazy
        >
          <PopoverAnchor>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleChangeDate}
              onBlur={handleBlurDate}
              onMouseDown={onOpen}
              aria-label={ariaLabel ?? '日付'}
              id={id}
            />
          </PopoverAnchor>
          <Show above="md">
            <PopoverContent ref={popoverContentRef} w="auto">
              <PopoverBody p="0">
                <DatePicker
                  value={[parseDate(oldInputValue.replaceAll('/', '-'))]}
                  selectionMode="single"
                  locale="ja"
                  max={parseDate(format(new Date(), 'yyyy-MM-dd'))}
                  disableFocus
                  onChange={handleClickDate}
                />
              </PopoverBody>
            </PopoverContent>
          </Show>
        </Popover>
      </Show>
      <Hide above="md">
        <Box
          role="button"
          aria-label={(ariaLabel ?? '日付') + ' ' + inputValue}
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onOpen()
              e.preventDefault()
            }
          }}
          tabIndex={0}
        >
          <Input
            ref={inputRef}
            value={inputValue}
            tabIndex={-1}
            id=""
            isReadOnly
            aria-hidden
            _focusVisible={{}}
          />
        </Box>
        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
          <ModalOverlay />
          <ModalContent w={300}>
            <ModalBody p="0" display="flex" justifyContent="center">
              <DatePicker
                value={[parseDate(oldInputValue.replaceAll('/', '-'))]}
                selectionMode="single"
                locale="ja"
                max={parseDate(format(new Date(), 'yyyy-MM-dd'))}
                fixedWeeks
                onChange={handleClickDate}
              />
            </ModalBody>
            <ModalFooter pt="0" px="2" justifyContent="start">
              <Button
                variant="ghost"
                color="secondaryGray"
                onClick={handleCloseModal}
              >
                キャンセル
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Hide>
    </>
  )
})

DateInput.displayName = 'DateInput'
export default DateInput

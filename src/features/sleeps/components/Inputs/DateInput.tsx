import {
  Input,
  InputGroup,
  InputProps,
  Modal,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Show,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react'
import { format, isValid, parse } from 'date-fns'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import DatePickerWrapper from './DatePickerWrapper'

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

  const [hasModalRendered, setHasModalRendered] = useState(false)
  useEffect(() => {
    if (isOpen) {
      setHasModalRendered(true)
    }
  }, [isOpen])

  const handleCloseModal = () => {
    setHasModalRendered(false)
    onClose()
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const formatted = format(value, 'yyyy/MM/dd')
  const [inputValue, setInputValue] = useState(formatted)
  const [oldInputValue, setOldInputValue] = useState(inputValue)

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
      setHasModalRendered(false)
      onClose()
    },
    [onChange, onClose]
  )

  return (
    <div>
      <Popover
        isOpen={isOpen}
        placement="bottom-start"
        initialFocusRef={inputRef}
      >
        <InputGroup>
          <PopoverAnchor>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleChangeDate}
              onBlur={handleBlurDate}
              onFocus={onOpen}
              {...rest}
            />
          </PopoverAnchor>
        </InputGroup>
        <Show above="md">
          <PopoverContent ref={popoverContentRef} w="auto">
            <DatePickerWrapper
              value={oldInputValue}
              colorScheme="green"
              onChange={handleClickDate}
            />
          </PopoverContent>
        </Show>
      </Popover>
      <Show below="md">
        <Modal
          isOpen={isOpen}
          onClose={handleCloseModal}
          returnFocusOnClose={false}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            w={300}
            visibility={hasModalRendered ? 'visible' : 'hidden'}
          >
            <DatePickerWrapper
              value={oldInputValue}
              colorScheme="green"
              onChange={handleClickDate}
            />
          </ModalContent>
        </Modal>
      </Show>
    </div>
  )
})

DateInput.displayName = 'DateInput'
export default DateInput

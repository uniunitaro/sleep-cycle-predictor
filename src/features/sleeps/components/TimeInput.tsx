import {
  Button,
  ButtonGroup,
  Input,
  InputGroup,
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
} from '@chakra-ui/react'
import { format, isValid, parse } from 'date-fns'
import { FC, memo, useRef, useState } from 'react'
import TimePicker from './TimePicker'

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
          <PopoverContent
            ref={popoverContentRef}
            w="auto"
            boxShadow="lg"
          ></PopoverContent>
        </Show>
      </Popover>
      <Show below="md">
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          returnFocusOnClose={false}
          isCentered
        >
          <ModalOverlay
            bg="blackAlpha.400"
            backdropFilter="blur(20px) saturate(180%)"
          />
          <ModalContent w={300}>
            <ModalBody pt="8">
              <TimePicker
                value={timePickerValue}
                onChange={handleChangeTimePicker}
              />
            </ModalBody>
            <ModalFooter>
              <ButtonGroup colorScheme="green">
                <Button variant="ghost" onClick={onClose}>
                  キャンセル
                </Button>
                <Button variant="ghost" onClick={handleConfirmTimePicker}>
                  OK
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Show>
    </div>
  )
})

TimeInput.displayName = 'TimeInput'
export default TimeInput

import { FC, memo, useState } from 'react'
import { format } from 'date-fns'
import TimePicker from './TimePicker/TimePicker'
import {
  Button,
  ButtonGroup,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@/components/chakra'

type Props = {
  value: Date
  onChange: (value: Date) => void
} & Omit<InputProps, 'value' | 'onChange'>
const MobileTimeInput: FC<Props> = memo(({ value, onChange, ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const formatted = format(value, 'HH:mm')
  const [inputValue, setInputValue] = useState(formatted)

  const [timePickerValue, setTimePickerValue] = useState(value)
  const handleChangeTimePicker = (date: Date) => {
    setTimePickerValue(date)
  }

  const handleConfirmTimePicker = () => {
    onChange(timePickerValue)
    setInputValue(format(timePickerValue, 'HH:mm'))
    onClose()
  }

  return (
    <>
      <Input value={inputValue} onFocus={onOpen} {...rest} />
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
    </>
  )
})

MobileTimeInput.displayName = 'MobileTimeInput'

export default MobileTimeInput

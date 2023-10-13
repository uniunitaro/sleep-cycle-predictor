import { FC, memo, useState } from 'react'
import { format } from 'date-fns'
import TimePicker from './TimePicker/TimePicker'
import {
  Box,
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from '@/components/chakra'

type Props = {
  value: Date
  ariaLabel?: string
  onChange: (value: Date) => void
}
const MobileTimeInput: FC<Props> = memo(({ value, ariaLabel, onChange }) => {
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
      <Box
        role="button"
        aria-label={ariaLabel ?? '日付'}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onOpen()
          }
        }}
        tabIndex={0}
      >
        <Input value={inputValue} tabIndex={-1} id="" isReadOnly aria-hidden />
      </Box>
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

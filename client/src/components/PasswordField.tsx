import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react'
import { forwardRef, useRef } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

const PasswordField = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { isOpen, onToggle } = useDisclosure()
  const inputRef = useRef<HTMLInputElement>(null)

  const mergeRef = useMergeRefs(inputRef, ref)
  const onClickReveal = () => {
    onToggle()
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }

  return (
    <InputGroup>
      <Input ref={mergeRef} type={isOpen ? 'text' : 'password'} {...props} />
      <InputRightElement>
        <IconButton
          variant="link"
          aria-label={isOpen ? 'パスワードを非表示' : 'パスワードを表示'}
          icon={isOpen ? <HiEyeOff /> : <HiEye />}
          onClick={onClickReveal}
          h="100%"
        />
      </InputRightElement>
    </InputGroup>
  )
})

PasswordField.displayName = 'PasswordField'
export default PasswordField

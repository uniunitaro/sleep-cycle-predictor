import {
  FormControl,
  FormLabel,
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

export const PasswordField = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
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
        <Input
          id="password"
          ref={mergeRef}
          name="password"
          type={isOpen ? 'text' : 'password'}
          {...props}
        />
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
  }
)

PasswordField.displayName = 'PasswordField'

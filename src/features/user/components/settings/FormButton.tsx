import { CheckIcon } from '@chakra-ui/icons'
import { Box, Button, ButtonProps, Flex, Icon } from '@chakra-ui/react'
import { FC, useEffect, useState } from 'react'

const FormButton: FC<ButtonProps & { isSuccess?: boolean }> = ({
  isSuccess,
  children,
  ...props
}) => {
  const [showSuccessIcon, setShowSuccessIcon] = useState(false)
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessIcon(true)
      setTimeout(() => {
        setShowSuccessIcon(false)
      }, 3000)
    }
  }, [isSuccess])

  return (
    <Button mt="29px" ml="4" flexShrink="0" colorScheme="green" {...props}>
      <Flex
        align="center"
        pos="absolute"
        opacity={showSuccessIcon ? 1 : 0}
        transition="opacity 0.3s"
      >
        <Icon as={CheckIcon} />
      </Flex>
      <Box opacity={showSuccessIcon ? 0 : 1} transition="opacity 0.3s">
        {children}
      </Box>
    </Button>
  )
}

export default FormButton

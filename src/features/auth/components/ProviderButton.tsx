import { FC } from 'react'
import { Button, ButtonProps } from '@/components/chakra'

const ProviderButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <Button
      iconSpacing="3"
      bgColor="white"
      variant="outline"
      w="full"
      {...rest}
    >
      {children}
    </Button>
  )
}

export default ProviderButton

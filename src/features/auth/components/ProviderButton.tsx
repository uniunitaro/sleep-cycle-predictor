import { FC } from 'react'
import { Button, ButtonProps, LightMode } from '@/components/chakra'

const ProviderButton: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <LightMode>
      <Button
        iconSpacing="3"
        bgColor="white"
        variant="outline"
        w="full"
        {...rest}
      >
        {children}
      </Button>
    </LightMode>
  )
}

export default ProviderButton

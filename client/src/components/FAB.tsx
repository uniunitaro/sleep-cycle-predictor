import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { FC } from 'react'

const FAB: FC<IconButtonProps> = (props) => {
  return (
    <IconButton
      w="54px"
      h="54px"
      position="fixed"
      bottom="4"
      right="4"
      zIndex="10"
      rounded="xl"
      boxShadow="0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)"
      {...props}
    />
  )
}

export default FAB

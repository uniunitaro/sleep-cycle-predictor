import { AddIcon } from '@chakra-ui/icons'
import { FC } from 'react'
import { Button, ButtonProps } from '@/components/chakra'

const AddSleepButton: FC<Omit<ButtonProps, 'children'>> = (props) => {
  return (
    <Button
      leftIcon={<AddIcon />}
      colorScheme="green"
      variant="shadow"
      {...props}
    >
      睡眠記録を追加
    </Button>
  )
}

export default AddSleepButton

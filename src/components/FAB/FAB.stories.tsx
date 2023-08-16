import { Meta, StoryObj } from '@storybook/react'
import { AddIcon } from '@chakra-ui/icons'
import FAB from './FAB'

export default { component: FAB } satisfies Meta<typeof FAB>

export const Default: StoryObj<typeof FAB> = {
  args: {
    colorScheme: 'green',
    icon: <AddIcon />,
  },
}

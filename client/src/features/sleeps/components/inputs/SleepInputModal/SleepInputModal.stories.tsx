import { Meta, StoryObj } from '@storybook/react'
import SleepInputModal from './SleepInputModal'

export default { component: SleepInputModal } satisfies Meta<
  typeof SleepInputModal
>

export const Default: StoryObj<typeof SleepInputModal> = {
  args: {
    isOpen: true,
  },
}

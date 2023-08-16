import { Meta, StoryObj } from '@storybook/react'
import TimePicker from './TimePicker'

export default { component: TimePicker } satisfies Meta<typeof TimePicker>

export const Default: StoryObj<typeof TimePicker> = {
  args: {
    value: new Date(2023, 0, 1),
  },
}

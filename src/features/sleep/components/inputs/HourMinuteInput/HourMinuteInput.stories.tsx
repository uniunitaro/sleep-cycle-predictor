import { Meta, StoryObj } from '@storybook/react'
import HourMinuteInput from './HourMinuteInput'

export default { component: HourMinuteInput } satisfies Meta<
  typeof HourMinuteInput
>

export const Default: StoryObj<typeof HourMinuteInput> = {
  args: {
    value: '12',
  },
}

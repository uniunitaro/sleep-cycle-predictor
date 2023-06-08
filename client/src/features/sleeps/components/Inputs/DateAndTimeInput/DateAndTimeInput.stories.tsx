import { Meta, StoryObj } from '@storybook/react'
import DateAndTimeInput from './DateAndTimeInput'

export default { component: DateAndTimeInput } satisfies Meta<
  typeof DateAndTimeInput
>

export const Default: StoryObj<typeof DateAndTimeInput> = {
  args: {
    value: new Date(2023, 0, 1),
  },
}

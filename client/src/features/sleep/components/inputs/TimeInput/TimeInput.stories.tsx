import { Meta, StoryObj } from '@storybook/react'
import TimeInput from './TimeInput'

export default { component: TimeInput } satisfies Meta<typeof TimeInput>

export const Default: StoryObj<typeof TimeInput> = {
  args: {
    value: new Date(2023, 0, 1),
  },
}

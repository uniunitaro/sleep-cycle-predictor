import { Meta, StoryObj } from '@storybook/react'
import DateInput from './DateInput'

export default { component: DateInput } satisfies Meta<typeof DateInput>

export const Default: StoryObj<typeof DateInput> = {
  args: {
    value: new Date(2023, 0, 1),
  },
}

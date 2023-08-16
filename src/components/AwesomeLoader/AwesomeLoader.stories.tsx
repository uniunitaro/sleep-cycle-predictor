import { Meta, StoryObj } from '@storybook/react'
import AwesomeLoader from './AwesomeLoader'

export default {
  component: AwesomeLoader,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AwesomeLoader>

export const Default: StoryObj<typeof AwesomeLoader> = {}

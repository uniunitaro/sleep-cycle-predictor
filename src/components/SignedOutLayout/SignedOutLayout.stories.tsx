import { Meta, StoryObj } from '@storybook/react'
import SignedOutLayout from './SignedOutLayout'

export default { component: SignedOutLayout } satisfies Meta<
  typeof SignedOutLayout
>

export const Default: StoryObj<typeof SignedOutLayout> = {}

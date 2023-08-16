import { Meta, StoryObj } from '@storybook/react'
import SignedOutHeader from './SignedOutHeader'

export default { component: SignedOutHeader } satisfies Meta<
  typeof SignedOutHeader
>

export const Default: StoryObj<typeof SignedOutHeader> = {}

import { Meta, StoryObj } from '@storybook/react'
import CardMdOnly from './CardMdOnly'

export default { component: CardMdOnly } satisfies Meta<typeof CardMdOnly>

export const Default: StoryObj<typeof CardMdOnly> = {
  args: {
    children: <div>Md以上のときはカードになります</div>,
  },
}

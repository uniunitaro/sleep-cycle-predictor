import { Meta, StoryObj } from '@storybook/react'
import { addHours } from 'date-fns'
import SleepChart from './SleepChart'
import { mockPrediction } from '@/mocks/prediction'

export default { component: SleepChart } satisfies Meta<typeof SleepChart>

const sleeps = [...Array(17)].map((_, i) => ({
  id: i + 1,
  sleeps: [
    {
      start: addHours(new Date(2023, 0, 1, 0), 25 * i),
      end: addHours(new Date(2023, 0, 1, 8), 25 * i),
    },
  ],
}))
const predictions = [...Array(13)].map((_, i) =>
  mockPrediction({
    start: addHours(new Date(2023, 0, 1, 0), 25 * (17 + i)),
    end: addHours(new Date(2023, 0, 1, 8), 25 * (17 + i)),
  })
)

export const Default: StoryObj<typeof SleepChart> = {
  args: {
    sleeps,
    predictions,
    isLoading: false,
    targetDate: new Date(2023, 0, 1),
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
}

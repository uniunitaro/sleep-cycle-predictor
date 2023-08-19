'use client'

import { FC } from 'react'
import { Prediction } from '../../types/sleep'
import { DisplayMode } from '../../types/chart'
import SleepChart from './SleepChart/SleepChart'

const PublicSleepChartContainer: FC<{
  userId: string
  predictions: Prediction[]
  targetDate: Date
  displayMode: DisplayMode
}> = ({ predictions, targetDate, displayMode }) => {
  return (
    <SleepChart
      sleeps={[]}
      predictions={predictions}
      targetDate={targetDate}
      displayMode={displayMode}
    />
  )
}

export default PublicSleepChartContainer

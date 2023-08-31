'use client'

import { FC, memo } from 'react'
import { getMonth } from 'date-fns'
import { useSetAtom } from 'jotai'
import {
  isSleepBottomSheetOpenAtom,
  selectedSleepOrPredictionAtom,
} from '../atoms/globalModals'
import SleepOverview from './SleepOverview'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import { Box, Stack } from '@/components/chakra'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  variant: 'mobile' | 'desktop'
}
const SleepList: FC<Props> = memo(
  ({ sleeps, predictions, targetDate, variant }) => {
    const currentMonthSleeps = sleeps.filter(
      (sleep) => getMonth(sleep.sleeps[0].start) === getMonth(targetDate)
    )
    const currentMonthPredictions = predictions.filter(
      (prediction) => getMonth(prediction.start) === getMonth(targetDate)
    )

    const setIsSleepBottomSheetOpen = useSetAtom(isSleepBottomSheetOpenAtom)
    const setSelectedSleepOrPrediction = useSetAtom(
      selectedSleepOrPredictionAtom
    )

    const handleClickSleep = (sleep: Sleep) => {
      setSelectedSleepOrPrediction(sleep)
      setIsSleepBottomSheetOpen(true)
    }
    const handleClickPrediction = (prediction: Prediction) => {
      setSelectedSleepOrPrediction(prediction)
      setIsSleepBottomSheetOpen(true)
    }

    return (
      <Stack gap="4">
        {currentMonthSleeps.map((sleep) => (
          <Box key={sleep.id} onClick={() => handleClickSleep(sleep)}>
            <SleepOverview
              sleep={sleep}
              variant={variant === 'desktop' ? 'withMenu' : 'default'}
            />
          </Box>
        ))}
        {currentMonthPredictions.map((prediction) => (
          <Box
            key={prediction.start.getTime()}
            onClick={() => handleClickPrediction(prediction)}
          >
            <SleepOverview
              prediction={prediction}
              key={prediction.start.getTime()}
            />
          </Box>
        ))}
      </Stack>
    )
  }
)

SleepList.displayName = 'SleepList'

export default SleepList

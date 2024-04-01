'use client'

import { FC, memo } from 'react'
import { getMonth } from 'date-fns'
import { useSetAtom } from 'jotai'
import Image from 'next/image'
import { Box, Center, Stack, Text, VStack } from '@chakra-ui/react'
import SleepOverview from './SleepOverview'
import {
  isSleepBottomSheetOpenAtom,
  selectedSleepOrPredictionAtom,
} from '@/features/sleep/atoms/globalModals'
import { Prediction, Sleep } from '@/features/sleep/types/sleep'
import notFoundImage from '@/assets/404.png'

type Props = {
  sleeps: Sleep[]
  predictions: Prediction[]
  targetDate: Date
  variant: 'mobile' | 'desktop'
  isPublic: boolean
}
const SleepList: FC<Props> = memo(
  ({ sleeps, predictions, targetDate, variant, isPublic }) => {
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

    return currentMonthSleeps.length || currentMonthPredictions.length ? (
      <Stack gap="4" role="list" aria-label="睡眠リスト">
        {currentMonthSleeps.map((sleep) => (
          <Box key={sleep.id} role="listitem">
            <Box
              role={variant === 'mobile' ? 'button' : undefined}
              tabIndex={variant === 'mobile' ? 0 : undefined}
              userSelect={variant === 'mobile' ? 'none' : undefined}
              sx={{
                WebkitTapHighlightColor: 'transparent',
              }}
              onClick={
                variant === 'mobile' ? () => handleClickSleep(sleep) : undefined
              }
              onKeyDown={(e) =>
                variant === 'mobile' &&
                e.key === 'Enter' &&
                handleClickSleep(sleep)
              }
            >
              <SleepOverview
                sleep={sleep}
                variant={variant === 'desktop' ? 'withMenu' : 'default'}
              />
            </Box>
          </Box>
        ))}
        {currentMonthPredictions.map((prediction) => (
          <Box key={prediction.start.getTime()} role="listitem">
            <Box
              role={variant === 'mobile' ? 'button' : undefined}
              tabIndex={variant === 'mobile' ? 0 : undefined}
              userSelect={variant === 'mobile' ? 'none' : undefined}
              sx={{
                WebkitTapHighlightColor: 'transparent',
              }}
              onClick={
                variant === 'mobile'
                  ? () => handleClickPrediction(prediction)
                  : undefined
              }
              onKeyDown={(e) =>
                variant === 'mobile' &&
                e.key === 'Enter' &&
                handleClickPrediction(prediction)
              }
            >
              <SleepOverview
                prediction={prediction}
                key={prediction.start.getTime()}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    ) : (
      <Center h="full">
        <VStack>
          <Image src={notFoundImage} alt="" width="100" />
          <Text fontSize="sm" textAlign="center">
            {isPublic ? '睡眠予測がありません。' : '睡眠記録がありません。'}
            {!isPublic && (
              <>
                <br />
                新しい記録を追加してみましょう。
              </>
            )}
          </Text>
        </VStack>
      </Center>
    )
  }
)

SleepList.displayName = 'SleepList'

export default SleepList

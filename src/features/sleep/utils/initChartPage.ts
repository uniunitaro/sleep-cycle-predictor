import { cookies } from 'next/headers'
import {
  subDays,
  startOfMonth,
  subMonths,
  startOfWeek,
  subWeeks,
  addDays,
  endOfMonth,
  addMonths,
  endOfWeek,
  addWeeks,
} from 'date-fns'
import { DisplayMode } from '../types/chart'
import { getSleeps } from '../repositories/sleeps'
import { getMyPredictions, getPredictions } from '../repositories/predictions'
import { Prediction, Sleep } from '../types/sleep'
import { SearchParams } from '@/types/global'
import { detectMobileByUserAgent } from '@/utils/detectMobileByUserAgent'

export const initChartPage = async ({
  isPublic,
  userId,
  searchParams,
}:
  | { isPublic: true; userId: string; searchParams: SearchParams }
  | {
      isPublic: false
      userId?: undefined
      searchParams: SearchParams
    }): Promise<{
  targetDate: Date
  hasTargetDate: boolean
  displayMode: DisplayMode
  sleeps?: Sleep[] | undefined
  predictions: Prediction[] | undefined
  error: true | undefined
}> => {
  const hasTargetDate = !!(
    searchParams.date && typeof searchParams.date === 'string'
  )

  // searchParamで日付が指定されていればその日付、されていなければ今日
  const targetDate = (() => {
    const { date } = searchParams
    if (typeof date !== 'string') return new Date()
    return new Date(date)
  })()

  const { isMobile } = detectMobileByUserAgent()

  const storedDisplayMode = cookies().get('displayMode')?.value as
    | DisplayMode
    | undefined
  const displayMode: DisplayMode =
    (typeof searchParams.displayMode === 'string' &&
      (searchParams.displayMode as DisplayMode)) ||
    storedDisplayMode ||
    (isMobile ? 'week' : 'month')

  // hasTargetDateがfalseのときはクライアントの今日の日付を基準とするが、
  // タイムゾーンの影響でサーバーの今日の日付とずれる可能性があり
  // startOfMonthなどが期待通りの結果を返さないため、2ヶ月分 or 2週間分のデータを取得する
  const start =
    displayMode === 'month'
      ? subDays(startOfMonth(subMonths(targetDate, hasTargetDate ? 1 : 2)), 1)
      : subDays(
          startOfWeek(
            subWeeks(startOfMonth(targetDate), hasTargetDate ? 1 : 2)
          ),
          1
        )

  const end =
    displayMode === 'month'
      ? addDays(endOfMonth(addMonths(targetDate, hasTargetDate ? 1 : 2)), 1)
      : addDays(
          endOfWeek(addWeeks(endOfMonth(targetDate), hasTargetDate ? 1 : 2)),
          1
        )

  if (isPublic) {
    const { predictions, error } = await getPredictions({
      userId,
      start: new Date(),
      end,
    })

    return { targetDate, hasTargetDate, displayMode, predictions, error }
  } else {
    const { sleeps, error } = await getSleeps({ start, end })

    const { predictions, error: predictionsError } = await getMyPredictions({
      start: new Date(),
      end,
    })

    return {
      targetDate,
      hasTargetDate,
      displayMode,
      sleeps,
      predictions,
      error: error || predictionsError,
    }
  }
}

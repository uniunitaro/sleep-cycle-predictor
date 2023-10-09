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
  displayMode: DisplayMode
  sleeps?: Sleep[] | undefined
  predictions: Prediction[] | undefined
  error: true | undefined
}> => {
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

  const start =
    displayMode === 'month'
      ? subDays(startOfMonth(subMonths(targetDate, 1)), 1)
      : subDays(startOfWeek(subWeeks(startOfMonth(targetDate), 1)), 1)

  const end =
    displayMode === 'month'
      ? addDays(endOfMonth(addMonths(targetDate, 1)), 1)
      : addDays(endOfWeek(addWeeks(endOfMonth(targetDate), 1)), 1)

  if (isPublic) {
    const { predictions, error } = await getPredictions({
      userId,
      start: new Date(),
      end,
    })

    return { targetDate, displayMode, predictions, error }
  } else {
    const { sleeps, error } = await getSleeps({ start, end })

    const { predictions, error: predictionsError } = await getMyPredictions({
      start: new Date(),
      end,
    })

    return {
      targetDate,
      displayMode,
      sleeps,
      predictions,
      error: error || predictionsError,
    }
  }
}

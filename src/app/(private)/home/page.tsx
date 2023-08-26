import { Metadata } from 'next'
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'
import { cookies } from 'next/headers'
import Home from './components/Home'
import { getSleeps } from '@/features/sleep/repositories/sleeps'
import { getMyPredictions } from '@/features/sleep/repositories/predictions'
import { SearchParams } from '@/types/global'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { DisplayMode } from '@/features/sleep/types/chart'
import { detectMobileByUserAgent } from '@/utils/detectMobileByUserAgent'

export const metadata: Metadata = {
  title: 'ホーム',
}

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  await redirectBasedOnAuthState('unauthed', '/signin')

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
    (typeof searchParams.view === 'string' &&
      (searchParams.view as DisplayMode)) ||
    storedDisplayMode ||
    (isMobile ? 'week' : 'month')

  // TODO エラー処理
  const { sleeps, error } = await getSleeps({
    start:
      displayMode === 'month'
        ? subDays(startOfMonth(subMonths(targetDate, 1)), 1)
        : subDays(startOfWeek(subWeeks(startOfMonth(targetDate), 1)), 1),
    end:
      displayMode === 'month'
        ? addDays(endOfMonth(addMonths(targetDate, 1)), 1)
        : addDays(endOfWeek(addWeeks(endOfMonth(targetDate), 1)), 1),
  })

  const { predictions, error: predictionsError } = await getMyPredictions({
    start:
      displayMode === 'month'
        ? subDays(startOfMonth(subMonths(targetDate, 1)), 1)
        : subDays(startOfWeek(subWeeks(startOfMonth(targetDate), 1)), 1),
    end:
      displayMode === 'month'
        ? addDays(endOfMonth(addMonths(targetDate, 1)), 1)
        : addDays(endOfWeek(addWeeks(endOfMonth(targetDate), 1)), 1),
  })

  return (
    sleeps &&
    predictions && (
      <Home
        sleeps={sleeps}
        predictions={predictions}
        targetDate={targetDate}
        displayMode={displayMode}
      />
    )
  )
}

export default HomePage

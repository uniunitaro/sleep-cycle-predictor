import { Metadata } from 'next'
import { addDays, endOfMonth, startOfMonth, subDays } from 'date-fns'
import Home from './components/Home'
import { getSleeps } from '@/features/sleep/repositories/sleeps'
import { getMyPredictions } from '@/features/sleep/repositories/predictions'
import { SearchParams } from '@/types/global'

export const metadata: Metadata = {
  title: 'ホーム - Sleep Cycle Predictor',
}

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  // searchParamで日付が指定されていればその日付、されていなければ今日
  const targetDate = (() => {
    const { date } = searchParams
    if (typeof date !== 'string') return new Date()
    return new Date(date)
  })()

  // TODO エラー処理
  const { sleeps, error } = await getSleeps({
    start: subDays(startOfMonth(targetDate ?? new Date()), 1),
    end: addDays(endOfMonth(targetDate ?? new Date()), 1),
  })

  const { predictions, error: predictionsError } = await getMyPredictions({
    start: subDays(startOfMonth(targetDate ?? new Date()), 1),
    end: addDays(endOfMonth(targetDate ?? new Date()), 1),
  })

  return (
    sleeps &&
    predictions && (
      <Home sleeps={sleeps} predictions={predictions} targetDate={targetDate} />
    )
  )
}

export default HomePage

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from 'date-fns'
import { cookies, headers } from 'next/headers'
import { getSelectorsByUserAgent } from 'react-device-detect'
import UserPublicPage from './components/UserPublicPage'
import { getUser } from '@/features/user/repositories/users'
import { getPredictions } from '@/features/sleep/repositories/predictions'
import { SearchParams } from '@/types/global'
import { DisplayMode } from '@/features/sleep/types/chart'

type Props = {
  params: { userId: string }
  searchParams: SearchParams
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { user, error } = await getUser(params.userId)
  if (error) {
    return {}
  }

  return {
    title: `${user.nickname}さんの睡眠予測`,
    description: `${user.nickname}さんの睡眠予測`,
  }
}

const UserPage = async ({ params, searchParams }: Props) => {
  const { userId } = params
  const { user, error } = await getUser(userId)
  if (error) {
    notFound()
  }

  // searchParamで日付が指定されていればその日付、されていなければ今日
  const targetDate = (() => {
    const { date } = searchParams
    if (typeof date !== 'string') return new Date()
    return new Date(date)
  })()

  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const { isMobile }: { isMobile: boolean } = userAgent
    ? getSelectorsByUserAgent(userAgent)
    : { isMobile: false }

  const storedDisplayMode = cookies().get('displayMode')?.value as
    | DisplayMode
    | undefined
  const displayMode: DisplayMode =
    (typeof searchParams.view === 'string' &&
      (searchParams.view as DisplayMode)) ||
    storedDisplayMode ||
    (isMobile ? 'week' : 'month')

  const { predictions, error: predictionsError } = await getPredictions({
    userId,
    start:
      displayMode === 'month'
        ? subDays(startOfMonth(subMonths(targetDate, 1)), 1)
        : subDays(startOfWeek(startOfMonth(targetDate)), 1),
    end:
      displayMode === 'month'
        ? addDays(endOfMonth(addMonths(targetDate, 1)), 1)
        : addDays(endOfWeek(endOfMonth(targetDate)), 1),
  })
  if (predictionsError) {
    notFound()
  }

  return (
    <UserPublicPage
      user={user}
      predictions={predictions}
      targetDate={targetDate}
      displayMode={displayMode}
    />
  )
}

export default UserPage

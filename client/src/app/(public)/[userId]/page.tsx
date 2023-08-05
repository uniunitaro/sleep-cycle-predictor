import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { addDays, endOfMonth, startOfMonth, subDays } from 'date-fns'
import UserPublicPage from './components/UserPublicPage'
import { getUser } from '@/features/user/repositories/users'
import { getPredictions } from '@/features/sleep/repositories/predictions'
import { SearchParams } from '@/types/global'

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
    title: `${user.nickname}さんの睡眠予測 - Sleep Cycle Predictor`,
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

  const { predictions, error: predictionsError } = await getPredictions({
    userId,
    start: subDays(startOfMonth(targetDate ?? new Date()), 1),
    end: addDays(endOfMonth(targetDate ?? new Date()), 1),
  })
  if (predictionsError) {
    notFound()
  }

  return (
    <UserPublicPage
      user={user}
      predictions={predictions}
      targetDate={targetDate}
    />
  )
}

export default UserPage

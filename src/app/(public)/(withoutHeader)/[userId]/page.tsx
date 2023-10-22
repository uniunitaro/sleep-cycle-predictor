import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UserPublicPage from './components/UserPublicPage'
import { getUser } from '@/features/user/repositories/users'
import { SearchParams } from '@/types/global'
import { initChartPage } from '@/features/sleep/utils/initChartPage'

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

  const TITLE = `${user.nickname}さんの睡眠予測`
  const DESCRIPTION = TITLE

  const ogSearchParams = new URLSearchParams({
    title: TITLE,
    ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
  })
  return {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      images: `/api/og/users?${ogSearchParams.toString()}`,
    },
  }
}

const UserPage = async ({ params, searchParams }: Props) => {
  const { userId } = params
  const { user, error } = await getUser(userId)
  if (error) {
    notFound()
  }

  const {
    targetDate,
    hasTargetDate,
    displayMode,
    predictions,
    error: predictionsError,
  } = await initChartPage({ isPublic: true, userId, searchParams })

  if (predictionsError || !predictions) {
    notFound()
  }

  return (
    <UserPublicPage
      user={user}
      predictions={predictions}
      targetDate={targetDate}
      hasTargetDate={hasTargetDate}
      displayMode={displayMode}
    />
  )
}

export default UserPage

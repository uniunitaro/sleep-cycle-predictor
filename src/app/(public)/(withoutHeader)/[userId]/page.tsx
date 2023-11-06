import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UserPublicPage from './components/UserPublicPage'
import { getUser } from '@/features/user/repositories/users'
import { SearchParams } from '@/types/global'
import { initChartPage } from '@/features/sleep/utils/initChartPage'
import { ogSettings } from '@/constants/og'

type Props = {
  params: { userId: string }
  searchParams: SearchParams
}

const isUuid = (userId: string) => {
  return /^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(userId)
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  if (!isUuid(params.userId)) {
    return notFound()
  }

  const { user, error } = await getUser(params.userId)
  if (error) {
    return notFound()
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
      ...ogSettings,
      title: TITLE,
      description: DESCRIPTION,
      images: `/api/og/users?${ogSearchParams.toString()}`,
    },
    robots: { index: false },
  }
}

const UserPage = async ({ params, searchParams }: Props) => {
  const { userId } = params
  if (!isUuid(userId)) {
    notFound()
  }

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

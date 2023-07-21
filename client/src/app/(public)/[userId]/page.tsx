import { Metadata } from 'next'
import UserPublicPage from './components/UserPublicPage'
import { getUser } from '@/features/user/apis/useUser'

type Props = { params: { userId: string } }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const user = await getUser(params.userId)
  return {
    title: `${user.nickname}さんの睡眠予測 - Sleep Cycle Predictor`,
  }
}

const UserPage = async ({ params }: Props) => {
  const user = await getUser(params.userId)

  return <UserPublicPage user={user}></UserPublicPage>
}

export default UserPage

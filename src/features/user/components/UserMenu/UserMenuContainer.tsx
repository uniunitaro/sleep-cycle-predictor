import { FC } from 'react'
import { getAuthUser } from '../../repositories/users'
import UserMenu from './UserMenu'

const UserMenuContainer: FC = async () => {
  // TODO エラー処理
  const { authUser, error } = await getAuthUser()
  return authUser && <UserMenu authUser={authUser} />
}

export default UserMenuContainer

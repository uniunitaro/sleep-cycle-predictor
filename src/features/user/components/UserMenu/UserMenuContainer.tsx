import { FC } from 'react'
import { getAuthUser } from '../../repositories/users'
import UserMenu from './UserMenu'

const UserMenuContainer: FC = async () => {
  const { authUser, error } = await getAuthUser()

  if (error) {
    throw new Error('Failed to get user')
  }

  return authUser && <UserMenu authUser={authUser} />
}

export default UserMenuContainer

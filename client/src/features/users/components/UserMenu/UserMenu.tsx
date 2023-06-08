import { FC } from 'react'
import {
  Avatar,
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react'
import { getAuth } from 'firebase/auth'
import { getApp } from 'firebase/app'
import { useAuthUserInfo } from '../../apis/useAuthUserInfo'

const UserMenu: FC = () => {
  const { data: authUserInfo } = useAuthUserInfo()

  const handleClickSignOut = () => {
    const auth = getAuth(getApp())
    auth.signOut()
  }

  return (
    <>
      {authUserInfo && (
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              icon={<Avatar size="sm" name={authUserInfo.nickname} />}
              aria-label={`アカウント: ${authUserInfo.nickname}`}
              variant="ghost"
              rounded="full"
            />
          </PopoverTrigger>
          <PopoverContent>
            <Button onClick={handleClickSignOut}>ログアウト</Button>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

export default UserMenu

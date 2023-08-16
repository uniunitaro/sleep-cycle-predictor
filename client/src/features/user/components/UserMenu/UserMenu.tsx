'use client'

import { FC } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { AuthUser } from '../../types/user'
import {
  Avatar,
  Button,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/chakra'

const UserMenu: FC<{ authUser: AuthUser }> = ({ authUser }) => {
  const router = useRouter()
  const handleClickSignOut = async () => {
    const supabase = createClientComponentClient()
    // TODO エラー処理
    await supabase.auth.signOut()
    router.replace('/')
  }

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <IconButton
          icon={<Avatar size="sm" name={authUser.nickname} />}
          aria-label={`アカウント: ${authUser.nickname}`}
          variant="ghost"
          rounded="full"
        />
      </PopoverTrigger>
      <PopoverContent>
        <Button onClick={handleClickSignOut}>ログアウト</Button>
      </PopoverContent>
    </Popover>
  )
}

export default UserMenu

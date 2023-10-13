'use client'

import { FC, useTransition } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { SettingsIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { MdLogout } from 'react-icons/md'
import { AuthUser } from '../../types/user'
import {
  Avatar,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from '@/components/chakra'

const UserMenu: FC<{ authUser: AuthUser }> = ({ authUser }) => {
  const { nickname, avatarUrl } = authUser

  const router = useRouter()
  const [, startTransition] = useTransition()
  const handleClickSignOut = async () => {
    const supabase = createClientComponentClient()
    // TODO エラー処理
    await supabase.auth.signOut()

    startTransition(() => {
      router.refresh()
      router.replace('/')
    })
  }

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        icon={
          <Avatar
            size="sm"
            name={nickname}
            src={avatarUrl ?? undefined}
            background={avatarUrl ? 'unset' : undefined}
            ignoreFallback
          />
        }
        aria-label={`アカウント: ${authUser.nickname}`}
        variant="ghost"
        rounded="full"
      />

      <MenuList>
        <MenuGroup title={`${authUser.nickname}さん`}>
          <MenuItem
            as={Link}
            href="/settings"
            icon={<Icon as={SettingsIcon} color="secondaryGray" />}
          >
            設定
          </MenuItem>
          <MenuItem
            onClick={handleClickSignOut}
            icon={<Icon as={MdLogout} color="secondaryGray" />}
          >
            ログアウト
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

export default UserMenu

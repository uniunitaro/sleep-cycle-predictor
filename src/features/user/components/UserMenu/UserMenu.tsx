'use client'

import { FC, useTransition } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { SettingsIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { MdLogout } from 'react-icons/md'
import { useAtom } from 'jotai'
import { AuthUser } from '../../types/user'
import {
  Avatar,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  useColorMode,
} from '@/components/chakra'
import { useSystemColorModeAtom } from '@/atoms/colorMode'
import { useErrorToast } from '@/hooks/useErrorToast'

const UserMenu: FC<{ authUser: AuthUser }> = ({ authUser }) => {
  const { nickname, avatarUrl } = authUser

  const router = useRouter()
  const [, startTransition] = useTransition()

  const errorToast = useErrorToast()
  const handleClickSignOut = async () => {
    const supabase = createClientComponentClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      errorToast()
      return
    }

    startTransition(() => {
      router.refresh()
      router.replace('/')
    })
  }

  const [useSystemColorMode, setUseSystemColorMode] = useAtom(
    useSystemColorModeAtom
  )
  const { colorMode, setColorMode } = useColorMode()

  const handleColorModeChange = (value: string | string[]) => {
    if (value === 'system') {
      setColorMode('system')
      setUseSystemColorMode(true)
    } else if (value === 'light') {
      setColorMode('light')
      setUseSystemColorMode(false)
    } else if (value === 'dark') {
      setColorMode('dark')
      setUseSystemColorMode(false)
    }
  }

  return (
    // useSystemColorModeはlocalStorageから取得するため、isLazyをtrueにしないとバグる
    <Menu placement="bottom-end" closeOnSelect={false} isLazy>
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
        <MenuOptionGroup
          title="カラーモード"
          defaultValue={useSystemColorMode ? 'system' : colorMode}
          type="radio"
          onChange={handleColorModeChange}
        >
          <MenuItemOption value="system">
            システムのモードを使用する
          </MenuItemOption>
          <MenuItemOption value="light">ライトモード</MenuItemOption>
          <MenuItemOption value="dark">ダークモード</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}

export default UserMenu

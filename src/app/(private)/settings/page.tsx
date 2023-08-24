import { Metadata } from 'next'
import Settings from './components/Settings'
import { getAuthUserWithConfig } from '@/features/user/repositories/users'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'

export const metadata: Metadata = {
  title: '設定',
}

const SettingsPage = async () => {
  await redirectBasedOnAuthState('unauthed', '/signin')

  // TODO エラー処理
  const { authUserWithConfig, error } = await getAuthUserWithConfig()
  return authUserWithConfig && <Settings userWithConfig={authUserWithConfig} />
}

export default SettingsPage
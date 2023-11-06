import { Metadata } from 'next'
import ResetPassword from './components/ResetPassword'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { ogSettings } from '@/constants/og'

const TITLE = 'パスワードのリセット'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogSettings,
  },
}

const SignInPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return (
    <main>
      <ResetPassword />
    </main>
  )
}

export default SignInPage

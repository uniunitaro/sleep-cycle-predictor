import { Metadata } from 'next'
import SignIn from './components/SignIn'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { ogSettings } from '@/constants/og'

const TITLE = 'ログイン'
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
      <SignIn />
    </main>
  )
}

export default SignInPage

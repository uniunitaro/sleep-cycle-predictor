import { Metadata } from 'next'
import SignIn from './components/SignIn'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'

const TITLE = 'ログイン'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
  },
}

const SignInPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignIn />
}

export default SignInPage

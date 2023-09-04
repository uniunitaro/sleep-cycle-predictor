import { Metadata } from 'next'
import SignIn from './components/SignIn'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { ogImages } from '@/constants/og'

const TITLE = 'ログイン'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogImages,
  },
}

const SignInPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignIn />
}

export default SignInPage

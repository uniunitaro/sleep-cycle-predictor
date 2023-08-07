import { Metadata } from 'next'
import SignIn from './components/SignIn'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'

export const metadata: Metadata = {
  title: 'ログイン - Sleep Cycle Predictor',
}

const SignInPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignIn />
}

export default SignInPage

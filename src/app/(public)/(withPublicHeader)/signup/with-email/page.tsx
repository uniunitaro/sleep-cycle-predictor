import { Metadata } from 'next'
import SignUpWithEmail from './components/SignUpWithEmail'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'

const TITLE = '新規登録'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
  },
}

const SignUpPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignUpWithEmail />
}

export default SignUpPage

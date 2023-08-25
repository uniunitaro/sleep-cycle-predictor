import { Metadata } from 'next'
import SignUpWithEmail from './components/SignUpWithEmail'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'

export const metadata: Metadata = {
  title: '新規登録',
}

const SignUpPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignUpWithEmail />
}

export default SignUpPage

import { Metadata } from 'next'
import SignUp from './components/SignUp'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'

export const metadata: Metadata = {
  title: '新規登録 - Sleep Cycle Predictor',
}

const SignUpPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignUp />
}

export default SignUpPage

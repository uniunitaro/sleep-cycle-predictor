import { Metadata } from 'next'
import SignUp from './components/SignUp'
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
  return <SignUp />
}

export default SignUpPage

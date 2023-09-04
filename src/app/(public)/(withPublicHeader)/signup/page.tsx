import { Metadata } from 'next'
import SignUp from './components/SignUp'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { ogImages } from '@/constants/og'

const TITLE = '新規登録'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogImages,
  },
}

const SignUpPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return <SignUp />
}

export default SignUpPage

import { Metadata } from 'next'
import SignUp from './components/SignUp'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { ogSettings } from '@/constants/og'

const TITLE = '新規登録'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogSettings,
  },
}

const SignUpPage = async () => {
  await redirectBasedOnAuthState('authed', '/home')
  return (
    <main>
      <SignUp />
    </main>
  )
}

export default SignUpPage

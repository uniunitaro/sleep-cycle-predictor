import { Metadata } from 'next'
import SignUpWithEmail from './components/SignUpWithEmail'
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
      <SignUpWithEmail />
    </main>
  )
}

export default SignUpPage

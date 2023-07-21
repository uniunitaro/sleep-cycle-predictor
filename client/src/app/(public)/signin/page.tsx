import { Metadata } from 'next'
import SignIn from './components/SignIn'

export const metadata: Metadata = {
  title: 'ログイン - Sleep Cycle Predictor',
}

const SignInPage = () => {
  return <SignIn />
}

export default SignInPage

import { Metadata } from 'next'
import SignUp from './components/SignUp'

export const metadata: Metadata = {
  title: '新規登録 - Sleep Cycle Predictor',
}

const SignUpPage = () => {
  return <SignUp />
}

export default SignUpPage

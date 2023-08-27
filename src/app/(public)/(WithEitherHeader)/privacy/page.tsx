import { Metadata } from 'next'
import Privacy from './components/Privacy'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
}

const PrivacyPage = () => {
  return <Privacy />
}

export default PrivacyPage

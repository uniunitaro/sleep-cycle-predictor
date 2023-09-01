import { Metadata } from 'next'
import Privacy from './components/Privacy'

const TITLE = 'プライバシーポリシー'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
  },
}

const PrivacyPage = () => {
  return <Privacy />
}

export default PrivacyPage

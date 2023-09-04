import { Metadata } from 'next'
import Privacy from './components/Privacy'
import { ogImages } from '@/constants/og'

const TITLE = 'プライバシーポリシー'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogImages,
  },
}

const PrivacyPage = () => {
  return <Privacy />
}

export default PrivacyPage

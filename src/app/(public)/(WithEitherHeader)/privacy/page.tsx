import { Metadata } from 'next'
import Privacy from './components/Privacy'
import { ogSettings } from '@/constants/og'

const TITLE = 'プライバシーポリシー'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogSettings,
  },
}

const PrivacyPage = () => {
  return (
    <main>
      <Privacy />
    </main>
  )
}

export default PrivacyPage

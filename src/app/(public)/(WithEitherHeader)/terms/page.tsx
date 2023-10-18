import { Metadata } from 'next'
import Terms from './components/Terms'
import { ogImages } from '@/constants/og'

const TITLE = '利用規約'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
    ...ogImages,
  },
}

const TermPage = () => {
  return (
    <main>
      <Terms />
    </main>
  )
}

export default TermPage

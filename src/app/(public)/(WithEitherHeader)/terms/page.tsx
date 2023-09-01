import { Metadata } from 'next'
import Terms from './components/Terms'

const TITLE = '利用規約'
export const metadata: Metadata = {
  title: TITLE,
  openGraph: {
    title: TITLE,
  },
}

const TermPage = () => {
  return <Terms />
}

export default TermPage

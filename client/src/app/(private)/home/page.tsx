import { Metadata } from 'next'
import Home from './components/Home'

export const metadata: Metadata = {
  title: 'ホーム - Sleep Cycle Predictor',
}

const HomePage = () => {
  return <Home />
}

export default HomePage

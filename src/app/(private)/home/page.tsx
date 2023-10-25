import { Metadata } from 'next'
import Home from './components/Home'
import { SearchParams } from '@/types/global'
import { redirectBasedOnAuthState } from '@/features/auth/utils/redirectBasedOnAuthState'
import { initChartPage } from '@/features/sleep/utils/initChartPage'

export const metadata: Metadata = {
  title: 'ホーム',
}

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  await redirectBasedOnAuthState('unauthed', '/signin')

  const { targetDate, hasTargetDate, displayMode, sleeps, predictions, error } =
    await initChartPage({ isPublic: false, searchParams })

  if (error) {
    throw new Error('Failed to initialize chart')
  }

  return (
    sleeps &&
    predictions && (
      <Home
        sleeps={sleeps}
        predictions={predictions}
        targetDate={targetDate}
        hasTargetDate={hasTargetDate}
        displayMode={displayMode}
      />
    )
  )
}

export default HomePage

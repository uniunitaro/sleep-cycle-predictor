'use server'

import { headers } from 'next/headers'
import { getSelectorsByUserAgent } from 'react-device-detect'

export const detectMobileByUserAgent = (): { isMobile: boolean } => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const { isMobile }: { isMobile: boolean } = userAgent
    ? getSelectorsByUserAgent(userAgent)
    : { isMobile: false }

  return { isMobile }
}

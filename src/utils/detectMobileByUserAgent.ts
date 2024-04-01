import { headers } from 'next/headers'

export const detectMobileByUserAgent = (): { isMobile: boolean } => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobile = !!userAgent?.includes('Mobi') && !userAgent?.includes('iPad')

  return { isMobile }
}

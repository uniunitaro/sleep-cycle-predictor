import { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, Roboto } from 'next/font/google'
import { AxiomWebVitals } from 'next-axiom'
import Providers from '@/components/Providers'
import ThemeColorManager from '@/components/ThemeColorManager'
import { ogSettings } from '@/constants/og'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import InstallPromptManager from '@/components/InstallPromptManager'

const DEFAULT_TITLE = 'Sleep Predictor'
const TITLE_TEMPLATE = '%s - Sleep Predictor'

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: DEFAULT_TITLE,
  },
  openGraph: {
    title: {
      default: DEFAULT_TITLE,
      template: TITLE_TEMPLATE,
    },
    ...ogSettings,
  },
  twitter: {
    card: 'summary_large_image',
  },
  metadataBase:
    process.env.VERCEL_ENV === 'production'
      ? new URL('https://www.sleep-predictor.com')
      : process.env.VERCEL_URL
      ? new URL(`https://${process.env.VERCEL_URL}`)
      : new URL(`http://localhost:${process.env.PORT || 3000}`),
}

// TODO カラーモードをcookieで管理してthemeColorを出し分ける
export const viewport: Viewport = {
  themeColor: '#f7f9f7',
}

export const runtime = 'edge'

const notoSans = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja-JP" className={`${notoSans.variable} ${roboto.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="xAfdL6ZaWvrHkTbulE1KM7b526NAjAd3tBm7E__LxAM"
        />
        <meta name="msvalidate.01" content="B7C4FCF4692F34C672D5080DAA12F16D" />
      </head>
      {process.env.VERCEL_ENV === 'production' && <AxiomWebVitals />}
      <GoogleAnalytics />
      <InstallPromptManager />
      <body>
        <Providers>
          {children}
          <ThemeColorManager />
        </Providers>
      </body>
    </html>
  )
}

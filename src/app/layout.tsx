import { Metadata } from 'next'
import { Noto_Sans_JP, Roboto } from 'next/font/google'
import { AxiomWebVitals } from 'next-axiom'
import Providers from '@/components/Providers'
import ThemeColorManager from '@/components/ThemeColorManager'
import { ogImages } from '@/constants/og'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import InstallPromptManager from '@/components/InstallPromptManager'

const DEFAULT_TITLE = 'Sleep Predictor'
const TITLE_TEMPLATE = '%s - Sleep Predictor'
const DESCRIPTION =
  '非24時間睡眠覚醒症候群の人をサポートする、睡眠サイクル予測アプリケーション。あなたの体内時計に合わせて、日々のスケジュールを調整しましょう。'

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: DEFAULT_TITLE,
  },
  themeColor: '#f7f9f7',
  openGraph: {
    type: 'website',
    siteName: 'Sleep Predictor',
    title: {
      default: DEFAULT_TITLE,
      template: TITLE_TEMPLATE,
    },
    description: DESCRIPTION,
    ...ogImages,
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

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

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

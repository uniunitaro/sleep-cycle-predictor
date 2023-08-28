import { Metadata } from 'next'
import { Noto_Sans_JP, Roboto } from 'next/font/google'
import Providers from '@/components/Providers'
import ThemeColorManager from '@/components/ThemeColorManager'

export const metadata: Metadata = {
  title: {
    template: '%s - Sleep Predictor',
    absolute: 'Sleep Predictor',
  },
  description:
    '非24時間睡眠覚醒症候群の人をサポートする、睡眠サイクル予測アプリケーション。あなたの体内時計に合わせて、日々のスケジュールを調整しましょう。',
  robots: { index: false },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sleep Predictor',
  },
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
      <body>
        <Providers>
          {children}
          <ThemeColorManager />
        </Providers>
      </body>
    </html>
  )
}

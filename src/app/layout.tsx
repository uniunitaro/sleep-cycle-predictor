import { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: {
    template: '%s - Sleep Predictor',
    absolute: 'Sleep Predictor',
  },
  description:
    '非24時間睡眠覚醒症候群の人をサポートする、睡眠サイクル予測アプリケーション。あなたの体内時計に合わせて、日々のスケジュールを調整しましょう。',
  robots: { index: false },
}

export const runtime = 'edge'

const notoSans = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja-JP" className={notoSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

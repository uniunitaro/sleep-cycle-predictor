import { Metadata } from 'next'
import Providers from './_components/Providers'

export const metadata: Metadata = {
  title: 'Sleep Cycle Predictor',
  description: '毎日ずれてゆくあなたの睡眠サイクルを華麗に予測！',
  robots: { index: false },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja-JP">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

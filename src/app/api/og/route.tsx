import { ImageResponse } from 'next/og'
import { loadGoogleFont } from './loadFont'
import OgCard from './components/OgCard'

export const runtime = 'edge'

export const GET = async () => {
  const text =
    '非24時間睡眠覚醒症候群の人をサポートする睡眠サイクル予測アプリケーション'
  const fontData = await loadGoogleFont('Noto+Sans+JP:wght@500', text)

  const logo = await fetch(new URL('./logo-big.png', import.meta.url)).then(
    (res) => res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <OgCard
        style={{
          fontFamily: 'NotoSansJP',
          flexDirection: 'column',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 50,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          width={600}
          // @ts-expect-error ignore
          src={logo}
        />
        <div
          style={{
            color: '#68758d',
            width: 600,
            display: 'flex',
            flexDirection: 'column',
            fontSize: 37,
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          非24時間睡眠覚醒症候群の人を
          <br />
          サポートする
          <br />
          睡眠サイクル予測アプリケーション
        </div>
      </OgCard>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'NotoSansJP',
          data: fontData,
          style: 'normal',
        },
      ],
    }
  )
}

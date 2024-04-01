import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { loadGoogleFont } from '../loadFont'
import OgCard from '../components/OgCard'

export const runtime = 'edge'

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title')
  const avatarUrl = searchParams.get('avatarUrl')
  if (!title) {
    throw new Error('title is required')
  }

  const fontData = await loadGoogleFont('Noto+Sans+JP:wght@700', title + '…')

  const logo = await fetch(new URL('../logo-big.png', import.meta.url)).then(
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
          padding: 50,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          width={400}
          // @ts-expect-error ignore
          src={logo}
          style={{
            marginTop: -50,
          }}
        />
        <div
          style={{
            display: 'flex',
            width: 600,
            gap: 20,
            alignItems: 'center',
          }}
        >
          {avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            <img
              src={avatarUrl}
              width="100"
              height="100"
              style={{
                borderRadius: '50%',
              }}
            />
          )}
          <div
            style={{
              color: '#1A202C',
              fontSize: 65,
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'block',
              lineClamp: 3,
            }}
          >
            {title}
          </div>
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

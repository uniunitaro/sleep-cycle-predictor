// https://developers.google.com/identity/protocols/oauth2/web-server?hl=ja

import { decrypt } from '@/utils/crypto'

export const generateAuthUrl = ({
  state,
  redirectUri,
}: {
  state: string
  redirectUri: string
}): string => {
  const searchParams = new URLSearchParams({
    scope: 'https://www.googleapis.com/auth/calendar.app.created',
    access_type: 'offline',
    include_granted_scopes: 'true',
    response_type: 'code',
    state,
    redirect_uri: redirectUri,
    client_id: `${process.env.GOOGLE_API_CLIENT_ID}`,
    prompt: 'consent',
  })
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.search = searchParams.toString()

  return url.toString()
}

export const getToken = async ({
  code,
  redirectUri,
}: {
  code: string
  redirectUri: string
}): Promise<{ accessToken: string; refreshToken: string | undefined }> => {
  const res: {
    access_token: string
    refresh_token: string
  } = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: `${process.env.GOOGLE_API_CLIENT_ID}`,
        client_secret: `${process.env.GOOGLE_API_CLIENT_SECRET}`,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
  ).json()

  return {
    accessToken: res.access_token,
    refreshToken: res.refresh_token,
  }
}

export const refreshToken = async ({
  encryptedRefreshToken,
}: {
  encryptedRefreshToken: string
}): Promise<string> => {
  const decryptedRefreshToken = await decrypt(encryptedRefreshToken)

  const res: { access_token: string } = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: `${process.env.GOOGLE_API_CLIENT_ID}`,
        client_secret: `${process.env.GOOGLE_API_CLIENT_SECRET}`,
        refresh_token: decryptedRefreshToken,
        grant_type: 'refresh_token',
      }),
    })
  ).json()

  return res.access_token
}

'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { generateAuthUrl } from '@/features/googleApi/services/auth'

export const redirectToGoogleAuth = async () => {
  const origin = headers().get('origin')

  const state = crypto.randomUUID()
  cookies().set('state', state, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
  })

  const url = generateAuthUrl({
    state,
    redirectUri: `${origin}/api/auth/calendar/callback`,
  })

  redirect(url)
}

import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { getToken } from '@/features/googleApi/services/auth'
import { createCalendar } from '@/features/googleApi/services/calendar'
import {
  getAuthUser,
  updateGoogleConfig,
} from '@/features/user/repositories/users'
import { syncPredictions } from '@/features/googleApi/server/syncPredictions'

export const runtime = 'edge'

const redirectWithErrorStatus = () => redirect('/settings?error=true')

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const savedState = cookies().get('state')?.value
  if (!code || !state || state !== savedState) {
    return redirectWithErrorStatus()
  }

  const origin = request.nextUrl.origin
  const { accessToken, refreshToken } = await getToken({
    code,
    redirectUri: `${origin}/api/auth/calendar/callback`,
  })

  const { authUser, error: userError } = await getAuthUser()
  if (userError) {
    return redirectWithErrorStatus()
  }

  const userName = authUser.nickname
  const calendarTitle = `${userName}の睡眠予測`
  const { calendar, error: calendarError } = await createCalendar(accessToken, {
    title: calendarTitle,
  })
  if (calendarError) {
    return redirectWithErrorStatus()
  }

  const { error: updateError } = await updateGoogleConfig({
    rawGoogleRefreshToken: refreshToken,
    googleCalendarId: calendar.id,
  })
  if (updateError) {
    return redirectWithErrorStatus()
  }

  const { error: syncError } = await syncPredictions()
  if (syncError) {
    return redirectWithErrorStatus()
  }

  return redirect('/settings')
}

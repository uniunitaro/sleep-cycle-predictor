'use server'

import { addYears } from 'date-fns'
import { deleteEvents, getAllEvents, insertEvents } from '../services/calendar'
import { refreshToken } from '../services/auth'
import { getMyPredictions } from '@/features/sleep/repositories/predictions'
import { getAuthUserWithConfig } from '@/features/user/repositories/users'

export const syncPredictions = async (): Promise<{ error?: true }> => {
  const { authUserWithConfig, error: userError } = await getAuthUserWithConfig()
  if (
    userError ||
    !authUserWithConfig.config.googleRefreshToken ||
    !authUserWithConfig.config.googleCalendarId
  ) {
    return { error: true }
  }

  const { predictions, error: predictionsError } = await getMyPredictions({
    start: new Date(),
    end: addYears(new Date(), 1),
  })
  if (predictionsError) {
    return { error: true }
  }

  const accessToken = await refreshToken({
    encryptedRefreshToken: authUserWithConfig.config.googleRefreshToken,
  })

  const { events, error: eventsError } = await getAllEvents(
    accessToken,
    authUserWithConfig.config.googleCalendarId
  )
  if (eventsError) {
    return { error: true }
  }

  const { error: deleteError } = await deleteEvents(accessToken, {
    calendarId: authUserWithConfig.config.googleCalendarId,
    ids: events.map((event) => event.id),
  })
  if (deleteError) {
    return { error: true }
  }

  const { error: insertError } = await insertEvents(accessToken, {
    calendarId: authUserWithConfig.config.googleCalendarId,
    events: predictions.map((prediction) => ({
      start: prediction.start,
      end: prediction.end,
    })),
  })
  if (insertError) {
    return { error: true }
  }

  return {}
}

'use server'

import { addYears, subSeconds } from 'date-fns'
import { deleteEvents, getAllEvents, insertEvents } from '../services/calendar'
import { refreshToken } from '../services/auth'
import { getMyPredictions } from '@/features/sleep/repositories/predictions'
import {
  getAuthUserWithConfig,
  updateGoogleConfig,
} from '@/features/user/repositories/users'

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

  const { events, error: eventsError } = await getAllEvents(accessToken, {
    calendarId: authUserWithConfig.config.googleCalendarId,
    lastUpdatedAt:
      authUserWithConfig.config.googleCalendarLastUpdatedAt ?? undefined,
  })
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

  // 時計誤差を考慮して1秒前の日時を指定
  const updatedAt = subSeconds(new Date(), 1)

  // 最終更新日時をDBに保存し、次回のイベント削除時にそれ以降のイベントのみ削除する
  // そうしないとgetAllEventsでは削除したイベントから順に取得されるため空の配列が返ってくる
  // https://stackoverflow.com/questions/18566386/
  const { error: updateConfigError } = await updateGoogleConfig({
    lastUpdatedAt: updatedAt,
  })
  if (updateConfigError) {
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

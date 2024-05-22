import { Calendar, Event, EventInsertInput } from '../types/calendar'
import { log } from '@/libs/axiomLogger'
import { Result } from '@/types/global'

export const createCalendar = async (
  accessToken: string,
  { title }: { title: string }
): Promise<Result<{ calendar: Calendar }, true>> => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: title,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return { calendar: (await response.json()) as Calendar }
  } catch (error) {
    log.error(error)
    return { error: true }
  }
}

const batch = async (
  accessToken: string,
  {
    calendarId,
    requests,
  }: {
    calendarId: string
    requests: (
      | { type: 'insert'; params: EventInsertInput }
      | { type: 'delete'; id: string }
    )[]
  }
): Promise<{ error?: true }> => {
  if (requests.length === 0) {
    return {}
  }

  try {
    const body = requests.map((request, i) => {
      const method = request.type === 'insert' ? 'POST' : 'DELETE'
      const basePath = `/calendar/v3/calendars/${calendarId}/events`
      const path =
        request.type === 'insert' ? basePath : `${basePath}/${request.id}`

      const insertBodyLines =
        request.type === 'insert'
          ? [
              'Content-Type: application/json',
              '',
              JSON.stringify(request.params),
            ]
          : []

      const lines = [
        '--batch_request',
        `Content-Type: application/http`,
        `Content-ID: ${i + 1}`,
        '',
        `${method} ${path}`,
        ...insertBodyLines,
        '',
      ]

      return lines.join('\r\n')
    })

    const response = await fetch(
      'https://www.googleapis.com/batch/calendar/v3',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/mixed; boundary=batch_request',
        },
        body: body.join('\r\n') + '--batch_request--',
      }
    )

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return {}
  } catch (error) {
    log.error(error)
    return { error: true }
  }
}

export const insertEvents = async (
  accessToken: string,
  {
    calendarId,
    events,
  }: {
    calendarId: string
    events: { start: Date; end: Date }[]
  }
): Promise<{ error?: true }> => {
  return batch(accessToken, {
    calendarId,
    requests: events.map((params) => ({
      type: 'insert',
      params: {
        start: { dateTime: params.start.toISOString(), timeZone: 'UTC' },
        end: { dateTime: params.end.toISOString(), timeZone: 'UTC' },
        summary: '睡眠予測',
      },
    })),
  })
}

export const deleteEvents = async (
  accessToken: string,
  {
    calendarId,
    ids,
  }: {
    calendarId: string
    ids: string[]
  }
): Promise<{ error?: true }> => {
  return batch(accessToken, {
    calendarId,
    requests: ids.map((id) => ({ type: 'delete', id })),
  })
}

export const getAllEvents = async (
  accessToken: string,
  { calendarId, lastUpdatedAt }: { calendarId: string; lastUpdatedAt?: Date }
): Promise<Result<{ events: Event[] }, true>> => {
  try {
    const searchParams = new URLSearchParams({
      maxResults: '1000',
      ...(lastUpdatedAt ? { updatedMin: lastUpdatedAt.toISOString() } : {}),
    })

    const url = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
    )
    url.search = searchParams.toString()

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return { events: ((await response.json()) as { items: Event[] }).items }
  } catch (error) {
    log.error(error)
    return { error: true }
  }
}

'use server'

import { addYears, isBefore } from 'date-fns'
import ICAL from 'ical.js'
import { Result } from '@/types/global'

export type ICalEvent = {
  start: Date
  end: Date
  summary: string | null
  description: string | null
  location: string | null
}

export const parseICals = async (
  urls: string[]
): Promise<
  Result<
    { data: { calendarName: string | undefined; events: ICalEvent[] }[] },
    true
  >
> => {
  const results = await Promise.all(urls.map((url) => parseICal(url)))

  if (results.some((result) => result.error)) return { error: true }

  return {
    // tsがerrorがfalseであることを推論してくれないのでevents = []としている
    data: results.map(({ calendarName, events = [] }) => ({
      calendarName,
      events,
    })),
  }
}

const parseICal = async (
  url: string
): Promise<
  Result<{ calendarName: string | undefined; events: ICalEvent[] }, true>
> => {
  const iCal = await fetch(url, { cache: 'no-store' })
    .then((res) => res.text())
    .catch(() => {
      return undefined
    })

  if (!iCal) return { error: true }

  const jCal = ICAL.parse(iCal)

  const comp = new ICAL.Component(jCal)

  const calendarName = comp.getFirstPropertyValue('x-wr-calname')

  const vevents = comp.getAllSubcomponents('vevent')

  const events: ICalEvent[] = vevents.flatMap((vevent) => {
    const event = new ICAL.Event(vevent)

    const iterator = event.iterator()
    let next: ICAL.Time | null
    let nextEvent: ICAL.Event | null
    const maxDate = addYears(new Date(), 5)
    const dates: { start: Date; end: Date }[] = []

    while (
      (next = iterator.next()) &&
      (nextEvent = event.getOccurrenceDetails(next)) &&
      isBefore(next.toJSDate(), maxDate)
    ) {
      dates.push({
        start: next.toJSDate(),
        end: nextEvent.endDate.toJSDate(),
      })
    }

    return dates.map((date) => ({
      ...date,
      summary: event.summary,
      description: event.description,
      location: event.location,
    }))
  })

  return { calendarName, events }
}

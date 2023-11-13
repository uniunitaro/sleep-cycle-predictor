import { useEffect, useState, useTransition } from 'react'
import { ICalEvent, parseICals } from '../server/parseICal'
import { useToast } from '@/components/chakra'
import { Calendar } from '@/db/schema'

export type CalendarWithEvents = {
  calendarName: string | undefined
  events: ICalEvent[]
}

export const useCalendarWithEvents = (calendars: Calendar[]) => {
  const [calendarWithEvents, setCalendarWithEvents] = useState<
    CalendarWithEvents[]
  >([])

  const [, startTransition] = useTransition()
  const toast = useToast()
  useEffect(() => {
    startTransition(async () => {
      const { data, error } = await parseICals(calendars.map((c) => c.url))
      if (error) {
        toast({
          title: '外部カレンダーの読み込みに失敗しました。',
          status: 'error',
        })
        return
      }

      setCalendarWithEvents(
        data.map(({ events }, i) => ({
          calendarName: calendars[i].name,
          events: events,
        }))
      )
    })
  }, [calendars, toast])

  return calendarWithEvents
}

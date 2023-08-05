import { format, subMonths, addMonths, startOfMonth } from 'date-fns'
import { usePathname, useSearchParams } from 'next/navigation'

export const useCalendarControlLinks = (targetDate: Date) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const previousDate = format(
    startOfMonth(subMonths(targetDate, 1)),
    'yyyy-MM-dd'
  )
  const previousSearchParams = new URLSearchParams([
    ...Array.from(searchParams.entries()).filter(([key]) => key !== 'date'),
    ['date', previousDate],
  ])
  const previousLink = `${pathname}?${previousSearchParams.toString()}`

  const nextDate = format(startOfMonth(addMonths(targetDate, 1)), 'yyyy-MM-dd')
  const nextSearchParams = new URLSearchParams([
    ...Array.from(searchParams.entries()).filter(([key]) => key !== 'date'),
    ['date', nextDate],
  ])
  const nextLink = `${pathname}?${nextSearchParams.toString()}`

  return {
    previousLink,
    nextLink,
  }
}

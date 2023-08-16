import { format, subMonths, addMonths, startOfMonth } from 'date-fns'
import { useHandleSearchParams } from '@/hooks/useHandleSearchParams'

export const useCalendarControl = (targetDate: Date) => {
  const { addSearchParamsWithCurrentPathname } = useHandleSearchParams()

  const previousDate = startOfMonth(subMonths(targetDate, 1))
  const previousDateString = format(previousDate, 'yyyy-MM-dd')
  const previousLink = addSearchParamsWithCurrentPathname(
    'date',
    previousDateString
  )

  const nextDate = startOfMonth(addMonths(targetDate, 1))
  const nextDateString = format(nextDate, 'yyyy-MM-dd')
  const nextLink = addSearchParamsWithCurrentPathname('date', nextDateString)

  return {
    previousDate,
    nextDate,
    previousLink,
    nextLink,
  }
}

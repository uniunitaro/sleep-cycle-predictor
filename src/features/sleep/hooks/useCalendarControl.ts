import {
  format,
  subMonths,
  addMonths,
  startOfMonth,
  startOfWeek,
  subWeeks,
  addWeeks,
} from 'date-fns'
import { DisplayMode } from '../types/chart'
import { useHandleSearchParams } from '@/hooks/useHandleSearchParams'

export const useCalendarControl = (
  targetDate: Date,
  displayMode: DisplayMode
) => {
  const { addSearchParamsWithCurrentPathname } = useHandleSearchParams()

  const previousDate =
    displayMode === 'month'
      ? startOfMonth(subMonths(targetDate, 1))
      : startOfWeek(subWeeks(targetDate, 1))
  const previousDateString = format(previousDate, 'yyyy-MM-dd')
  const previousLink = addSearchParamsWithCurrentPathname(
    'date',
    previousDateString
  )

  const nextDate =
    displayMode === 'month'
      ? startOfMonth(addMonths(targetDate, 1))
      : startOfWeek(addWeeks(targetDate, 1))
  const nextDateString = format(nextDate, 'yyyy-MM-dd')
  const nextLink = addSearchParamsWithCurrentPathname('date', nextDateString)

  return {
    previousDate,
    nextDate,
    previousLink,
    nextLink,
  }
}

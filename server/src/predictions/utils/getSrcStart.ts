import { Config } from '@prisma/client'
import { startOfDay, subMonths, subWeeks, subYears } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

export const getSrcStart = async (
  duration: Config['predictionSrcDuration'],
): Promise<Date> => {
  const getZonedStartOfDayInUtc = (date: Date) =>
    zonedTimeToUtc(startOfDay(utcToZonedTime(date, 'Asia/Tokyo')), 'Asia/Tokyo')

  switch (duration) {
    case 'week1':
      return getZonedStartOfDayInUtc(subWeeks(new Date(), 1))
    case 'week2':
      return getZonedStartOfDayInUtc(subWeeks(new Date(), 2))
    case 'month1':
      return getZonedStartOfDayInUtc(subMonths(new Date(), 1))
    case 'month2':
      return getZonedStartOfDayInUtc(subMonths(new Date(), 2))
    case 'month3':
      return getZonedStartOfDayInUtc(subMonths(new Date(), 3))
    case 'month4':
      return getZonedStartOfDayInUtc(subMonths(new Date(), 4))
    case 'month6':
      return getZonedStartOfDayInUtc(subMonths(new Date(), 6))
    case 'year1':
      return getZonedStartOfDayInUtc(subYears(new Date(), 1))
  }
}

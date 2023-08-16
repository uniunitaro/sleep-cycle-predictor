import { subMonths, subWeeks, subYears } from 'date-fns'
import { Config } from '@/db/schema'

export const getSrcStart = (
  duration: Config['predictionSrcDuration']
): Date => {
  switch (duration) {
    case 'week1':
      return subWeeks(new Date(), 1)
    case 'week2':
      return subWeeks(new Date(), 2)
    case 'month1':
      return subMonths(new Date(), 1)
    case 'month2':
      return subMonths(new Date(), 2)
    case 'month3':
      return subMonths(new Date(), 3)
    case 'month4':
      return subMonths(new Date(), 4)
    case 'month6':
      return subMonths(new Date(), 6)
    case 'year1':
      return subYears(new Date(), 1)
  }
}

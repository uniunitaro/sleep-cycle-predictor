import { subMonths, subWeeks, subYears } from 'date-fns'
import { Config } from '@/db/schema'

export const getSrcStart = (
  config: Pick<Config, 'predictionSrcDuration' | 'predictionSrcStartDate'>
): Date => {
  switch (config.predictionSrcDuration) {
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
    case 'year10':
      // for testing only
      return subYears(new Date(), 10)
    case 'custom':
      if (!config.predictionSrcStartDate) {
        throw new Error('predictionSrcStartDate is not set')
      }
      return config.predictionSrcStartDate
  }
}

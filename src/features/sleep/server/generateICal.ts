import { EventAttributes, createEvents } from 'ics'
import { Prediction } from '../types/sleep'
import { Result } from '@/types/global'
import { log } from '@/libs/axiomLogger'

export const generateICal = (
  predictions: Prediction[]
): Result<{ iCalData: string }, true> => {
  const { error, value } = createEvents(
    predictions.map((prediction) => {
      const { start, end } = prediction
      return {
        start: [
          start.getFullYear(),
          start.getMonth() + 1,
          start.getDate(),
          start.getHours(),
          start.getMinutes(),
        ],
        end: [
          end.getFullYear(),
          end.getMonth() + 1,
          end.getDate(),
          end.getHours(),
          end.getMinutes(),
        ],
        // 一応UTCを指定している
        startInputType: 'utc',
        endInputType: 'utc',
        title: '睡眠予測',
      } satisfies EventAttributes
    })
  )

  if (error) {
    log.error(error)
    return { error: true }
  }

  return { iCalData: value ?? '' }
}

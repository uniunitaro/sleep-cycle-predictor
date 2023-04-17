import { createQueryKeys } from '@lukemorales/query-key-factory'
import axios from 'axios'
import { utcToZonedTime } from 'date-fns-tz'
import { useQuery } from '@tanstack/react-query'
import {
  GetPredictionsRequest,
  GetPredictionsResponse,
} from '@/pages/api/users/[userId]/sleeps/predictions'
import { TIMEZONE } from '@/constants/date'

export const predictionKeys = createQueryKeys('predictions', {
  list: (payload: GetPredictionsRequest) => ({
    queryKey: [payload],
    queryFn: (): Promise<{ start: Date; end: Date }[]> =>
      axios
        .get<GetPredictionsResponse>('/api/users/me/sleeps/predictions', {
          params: payload,
        })
        .then((res) =>
          res.data.map((s) => ({
            ...s,
            start: utcToZonedTime(s.start, TIMEZONE),
            end: utcToZonedTime(s.end, TIMEZONE),
          }))
        ),
  }),
})

export const usePredictions = (payload: GetPredictionsRequest) => {
  return useQuery(predictionKeys.list(payload))
}

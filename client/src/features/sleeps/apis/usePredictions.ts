import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useQuery } from '@tanstack/react-query'
import { GetPredictionsResponse } from '@server/src/sleeps/sleeps.type'
import { GetMyPredictionsRequest } from '@server/src/sleeps/sleeps.dto'
import { api } from '@/libs/axios'

export const predictionKeys = createQueryKeys('predictions', {
  list: (payload: GetMyPredictionsRequest) => ({
    queryKey: [payload],
    queryFn: (): Promise<{ start: Date; end: Date }[]> =>
      api
        .get<GetPredictionsResponse>('/api/users/me/sleeps/predictions', {
          params: payload,
        })
        .then((res) => res.data),
  }),
})

export const usePredictions = (payload: GetMyPredictionsRequest) => {
  return useQuery(predictionKeys.list(payload))
}

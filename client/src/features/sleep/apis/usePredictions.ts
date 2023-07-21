import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useQuery } from '@tanstack/react-query'
import {
  GetMyPredictionsRequest,
  GetPredictionsRequest,
} from '@shared-types/predictions/predictions.dto'
import { GetPredictionsResponse } from '@shared-types/predictions/predictions.type'
import { Prediction } from '../types/sleep'
import { api } from '@/libs/axios'

export const predictionKeys = createQueryKeys('predictions', {
  myList: (payload: GetMyPredictionsRequest) => ({
    queryKey: [payload],
    queryFn: (): Promise<Prediction[]> =>
      api
        .get<GetPredictionsResponse>('/api/users/me/predictions', {
          params: payload,
        })
        .then((res) => res.data),
  }),
  list: (userId: string, payload: GetPredictionsRequest) => ({
    queryKey: [userId, payload],
    queryFn: (): Promise<Prediction[]> =>
      api
        .get<GetPredictionsResponse>(`/api/users/${userId}/predictions`, {
          params: payload,
        })
        .then((res) => res.data),
  }),
})

export const useMyPredictions = (payload: GetMyPredictionsRequest) => {
  return useQuery(predictionKeys.myList(payload))
}

export const usePredictions = (
  userId: string,
  payload: GetPredictionsRequest
) => {
  return useQuery(predictionKeys.list(userId, payload))
}

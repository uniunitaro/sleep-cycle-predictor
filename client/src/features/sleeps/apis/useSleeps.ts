import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import {
  GetSleepsRequest,
  PostSleepRequest,
} from '@shared-types/sleeps/sleeps.dto'
import {
  GetSleepsResponse,
  PostSleepResponse,
} from '@shared-types/sleeps/sleeps.type'
import { Sleep } from '../types/sleep'
import { api } from '@/libs/axios'

export const sleepKeys = createQueryKeys('sleeps', {
  list: (payload: GetSleepsRequest) => ({
    queryKey: [payload],
    queryFn: (): Promise<Sleep[]> =>
      api
        .get<GetSleepsResponse>('/api/users/me/sleeps', { params: payload })
        .then((res) => res.data),
  }),
})

export const useCreateSleep = () => {
  const queryClient = useQueryClient()

  return useMutation<Sleep, unknown, PostSleepRequest>(
    (payload) => {
      return api
        .post<PostSleepResponse>('/api/users/me/sleeps', payload)
        .then((res) => res.data)
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(sleepKeys._def)
        const { queries } = await import('@/libs/queryKeys')
        queryClient.invalidateQueries(queries.predictions._def)
      },
    }
  )
}

export const useSleeps = (payload: GetSleepsRequest) => {
  return useQuery(sleepKeys.list(payload))
}

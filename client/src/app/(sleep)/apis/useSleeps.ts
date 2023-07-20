import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createQueryKeys } from '@lukemorales/query-key-factory'

import {
  GetSleepsRequest,
  CreateSleepRequest,
} from '@shared-types/sleeps/sleeps.dto'
import {
  GetSleepsResponse,
  CreateSleepResponse,
} from '@shared-types/sleeps/sleeps.type'
import { Sleep } from '../types/sleep'
import { api } from '@/libs/axios'

export const sleepKeys = createQueryKeys('sleeps', {
  list: (payload: GetSleepsRequest) => ({
    queryKey: [payload],
    queryFn: (): Promise<Sleep[]> =>
      api
        .get<GetSleepsResponse>('/api/users/me/sleeps', { params: payload })
        .then((res) =>
          res.data.map((sleep) => ({
            id: sleep.id,
            sleeps: [
              { start: sleep.start, end: sleep.end },
              ...sleep.segmentedSleeps,
            ],
          }))
        ),
  }),
})

export const useCreateSleep = () => {
  const queryClient = useQueryClient()

  return useMutation<Sleep, unknown, CreateSleepRequest>(
    (payload) => {
      return api
        .post<CreateSleepResponse>('/api/users/me/sleeps', payload)
        .then((res) => ({
          id: res.data.id,
          sleeps: [
            { start: res.data.start, end: res.data.end },
            ...res.data.segmentedSleeps,
          ],
        }))
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

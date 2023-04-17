import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { utcToZonedTime } from 'date-fns-tz'
import { Sleep } from '../types/sleep'
import {
  GetSleepsRequest,
  GetSleepsResponse,
  PostSleepRequest,
  PostSleepResponse,
} from '@/pages/api/users/[userId]/sleeps'
import { TIMEZONE } from '@/constants/date'

export const sleepKeys = createQueryKeys('sleeps', {
  list: (payload: GetSleepsRequest) => ({
    queryKey: [payload],
    queryFn: (): Promise<Sleep[]> =>
      axios
        .get<GetSleepsResponse>('/api/users/me/sleeps', { params: payload })
        .then((res) =>
          res.data.map((s) => ({
            ...s,
            start: utcToZonedTime(s.start, TIMEZONE),
            end: utcToZonedTime(s.end, TIMEZONE),
          }))
        ),
  }),
})

export const useCreateSleep = () => {
  const queryClient = useQueryClient()

  return useMutation<Sleep, unknown, PostSleepRequest>(
    (payload) => {
      return axios
        .post<PostSleepResponse>('/api/users/me/sleeps', payload)
        .then((res) => ({
          ...res.data,
          start: utcToZonedTime(res.data.start, TIMEZONE),
          end: utcToZonedTime(res.data.end, TIMEZONE),
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

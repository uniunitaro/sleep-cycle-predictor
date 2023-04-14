import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { utcToZonedTime } from 'date-fns-tz'
import {
  GetSleepsRequest,
  GetSleepsResponse,
  PostSleepResponse,
} from '@/pages/api/sleeps'
import { TIMEZONE } from '@/constants/date'

const sleepKeys = createQueryKeys('sleeps', {
  list: (payload: GetSleepsRequest) => ({
    queryKey: [payload],
    queryFn: () =>
      axios
        .get<GetSleepsResponse>('/api/sleeps', { params: payload })
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

  return useMutation<PostSleepResponse, unknown, { start: Date; end: Date }>(
    (payload) => {
      const start = payload.start.toISOString()
      const end = payload.end.toISOString()
      return axios
        .post<PostSleepResponse>('/api/sleeps', { start, end })
        .then((res) => res.data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(sleepKeys._def)
      },
    }
  )
}

export const useSleeps = ({ start, end }: { start: Date; end: Date }) => {
  const startString = start.toISOString()
  const endString = end.toISOString()

  return useQuery(sleepKeys.list({ start: startString, end: endString }))
}

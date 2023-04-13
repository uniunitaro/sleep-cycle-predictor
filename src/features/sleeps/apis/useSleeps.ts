import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { PostSleepRequest, PostSleepResponse } from '@/pages/api/sleeps'

const sleepKeys = createQueryKeys('sleeps', {
  all: null,
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

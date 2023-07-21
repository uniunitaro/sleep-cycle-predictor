import { createQueryKeys } from '@lukemorales/query-key-factory'
import { useQuery } from '@tanstack/react-query'
import { GetUserResponse } from '@shared-types/users/users.type'
import { User } from '../types/user'
import { api } from '@/libs/axios'

export const getUser = (userId: string): Promise<User> => {
  return api
    .get<GetUserResponse>(`/api/users/${userId}`)
    .then((res) => res.data)
}

export const userKeys = createQueryKeys('users', {
  detail: (userId: string) => ({
    queryKey: [userId],
    queryFn: getUser(userId),
  }),
})

export const useUser = (userId: string) => {
  return useQuery(userKeys.detail(userId))
}

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { GetMeResponse } from '@shared-types/users/users.type'
import { AuthUserInfo } from '../types/user'
import { api } from '@/libs/axios'

const authUserKeys = createQueryKeys('authUser')

export const useAuthUserInfo = () => {
  return useQuery<AuthUserInfo>(authUserKeys._def, () =>
    api.get<GetMeResponse>('/api/users/me').then((res) => res.data)
  )
}

export const useResetAuthUserInfo = () => {
  const queryClient = useQueryClient()
  return queryClient.resetQueries(authUserKeys._def)
}

import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { AuthUserInfo } from '../types/user'
import { GetMeResponse } from '@/pages/api/user/me'

const authUserKeys = createQueryKeys('authUser')

export const useAuthUserInfo = () => {
  return useQuery<AuthUserInfo>(authUserKeys._def, () =>
    axios.get<GetMeResponse>('/api/user/me').then((res) => res.data)
  )
}

export const useResetAuthUserInfo = () => {
  const queryClient = useQueryClient()
  return queryClient.resetQueries(authUserKeys._def)
}

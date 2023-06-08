import { rest } from 'msw'
import { mockAuthUser } from '@/mocks/user'

export const getApiUrl = (endpoint: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`
}

export const handlers = {
  user: [
    rest.get(getApiUrl('/api/users/me'), (_req, res, ctx) => {
      return res(ctx.json(mockAuthUser()))
    }),
  ],
}

import { GetMeResponse } from '@shared-types/users/users.type'

export const mockAuthUser = (
  modification?: Partial<GetMeResponse>
): GetMeResponse => ({
  createdAt: new Date(),
  updatedAt: new Date(),
  id: '1',
  email: 'mock@example.com',
  nickname: 'モック太郎',
  ...modification,
})

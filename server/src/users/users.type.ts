export type GetMeResponse = {
  id: string
  nickname: string
  email: string | null
}

export type CreateUserResponse = GetMeResponse

export type GetUserResponse = {
  id: string
  nickname: string
}

import { Calendar, Config, User as DBUser } from '@prisma/client'

export type AuthUser = DBUser

export type AuthUserWithConfig = DBUser & {
  config: Config & { calendars: Calendar[] }
}

export type User = Pick<DBUser, 'id' | 'nickname' | 'avatarUrl'>

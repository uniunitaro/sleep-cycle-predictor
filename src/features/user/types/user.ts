import { Config, User as DBUser } from '@/db/schema'

export type AuthUser = DBUser

export type AuthUserWithConfig = DBUser & { config: Config }

export type User = Omit<DBUser, 'email'>

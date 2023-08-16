import { User as DBUser } from '@/db/schema'

export type AuthUser = DBUser

export type User = Omit<DBUser, 'email'>

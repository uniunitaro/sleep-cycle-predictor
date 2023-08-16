'use server'

import { eq } from 'drizzle-orm'
import { AuthUser, User } from '../types/user'
import { db } from '@/db'
import { user } from '@/db/schema'
import { Result } from '@/types/global'
import { getAuthUserIdWithServerComponent } from '@/utils/getAuthUserId'

export const getAuthUser = async (): Promise<
  Result<{ authUser: AuthUser }, true>
> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const authUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    })
    if (!authUser) throw new Error('user not found')

    return { authUser }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const getUser = async (
  id: string
): Promise<Result<{ user: User }, true>> => {
  try {
    const userResult = await db.query.user.findFirst({
      where: eq(user.id, id),
    })
    if (!userResult) throw new Error('user not found')

    return { user: userResult }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

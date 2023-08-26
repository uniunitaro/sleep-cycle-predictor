'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { AuthUser, AuthUserWithConfig, SrcDuration, User } from '../types/user'
import { db } from '@/db'
import { config, user } from '@/db/schema'
import { Result } from '@/types/global'
import {
  getAuthUserIdWithServerAction,
  getAuthUserIdWithServerComponent,
} from '@/utils/getAuthUserId'
import { uuidToBin } from '@/utils/uuidToBin'

export const addUser = async ({
  id,
  nickname,
  email,
}: {
  id: string
  nickname: string
  email: string
}): Promise<{ error?: true }> => {
  try {
    await db.transaction(async (tx) => {
      const existingUser = await tx.query.user.findFirst({
        where: eq(user.id, uuidToBin(id)),
      })
      if (existingUser) return

      await tx.insert(user).values({
        id: uuidToBin(id),
        nickname,
        email,
      })

      await tx.insert(config).values({
        userId: uuidToBin(id),
      })
    })

    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const getAuthUser = async (): Promise<
  Result<{ authUser: AuthUser }, true>
> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const authUser = await db.query.user.findFirst({
      where: eq(user.id, uuidToBin(userId)),
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
      where: eq(user.id, uuidToBin(id)),
    })
    if (!userResult) throw new Error('user not found')

    return { user: userResult }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const getAuthUserWithConfig = async (): Promise<
  Result<{ authUserWithConfig: AuthUserWithConfig }, true>
> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const authUserWithConfig = await db.query.user.findFirst({
      where: eq(user.id, uuidToBin(userId)),
      with: { config: true },
    })
    if (!authUserWithConfig) throw new Error('user not found')

    return { authUserWithConfig }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const updateAuthUser = async ({
  nickname,
  newEmail,
}: {
  nickname?: string
  newEmail?: string
}): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await db
      .update(user)
      .set({
        nickname: nickname,
        newEmail: newEmail,
      })
      .where(eq(user.id, uuidToBin(userId)))

    revalidatePath('/settings')
    revalidatePath('/home')
    revalidatePath('/[userId]')
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const updateEmail = async (
  userId: string
): Promise<{ error?: true }> => {
  try {
    const result = await db.query.user.findFirst({
      where: eq(user.id, uuidToBin(userId)),
      columns: {
        newEmail: true,
      },
    })
    if (!result?.newEmail) throw new Error('newEmail not found')

    await db
      .update(user)
      .set({
        email: result.newEmail,
        newEmail: null,
      })
      .where(eq(user.id, uuidToBin(userId)))

    revalidatePath('/settings')
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export const updateConfig = async ({
  predictionSrcDuration,
}: {
  predictionSrcDuration: SrcDuration
}): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await db
      .update(config)
      .set({
        predictionSrcDuration,
      })
      .where(eq(config.userId, uuidToBin(userId)))

    revalidatePath('/settings')
    revalidatePath('/home')
    revalidatePath('/[userId]')
    return {}
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

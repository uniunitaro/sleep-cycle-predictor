'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { AuthUser, AuthUserWithConfig, SrcDuration, User } from '../types/user'
import { db } from '@/db'
import { calendar, config, user } from '@/db/schema'
import { Result } from '@/types/global'
import {
  getAuthUserIdWithServerAction,
  getAuthUserIdWithServerComponent,
} from '@/utils/getAuthUserId'
import { uuidToBin } from '@/utils/uuid'
import { log } from '@/libs/axiomLogger'

export const addUser = async ({
  id,
  nickname,
  email,
  avatarUrl,
}: {
  id: string
  nickname: string
  email: string
  avatarUrl?: string
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
        avatarUrl,
      })

      await tx.insert(config).values({
        userId: uuidToBin(id),
      })
    })

    return {}
  } catch (e) {
    log.error(e)
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
    log.error(e)
    return { error: true }
  }
}

export const getUser = async (
  id: string
): Promise<Result<{ user: User }, true>> => {
  try {
    const userResult = await db.query.user.findFirst({
      where: eq(user.id, uuidToBin(id)),
      columns: {
        id: true,
        nickname: true,
        avatarUrl: true,
      },
    })
    if (!userResult) throw new Error('user not found')

    return { user: userResult }
  } catch (e) {
    log.error(e)
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
      with: {
        config: {
          with: { calendars: true },
        },
      },
    })
    if (!authUserWithConfig) throw new Error('user not found')

    return { authUserWithConfig }
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const updateAuthUser = async ({
  nickname,
  newEmail,
  avatarUrl,
}: {
  nickname?: string
  newEmail?: string
  avatarUrl?: string
}): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await db
      .update(user)
      .set({
        nickname: nickname,
        newEmail: newEmail,
        avatarUrl: avatarUrl,
      })
      .where(eq(user.id, uuidToBin(userId)))

    revalidatePath('/settings')
    revalidatePath('/home')
    revalidatePath('/[userId]')
    return {}
  } catch (e) {
    log.error(e)
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
    log.error(e)
    return { error: true }
  }
}

export const updateConfig = async ({
  predictionSrcDuration,
  predictionSrcStartDate,
}: {
  predictionSrcDuration?: SrcDuration
  predictionSrcStartDate?: Date
}): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await db
      .update(config)
      .set({
        predictionSrcDuration,
        predictionSrcStartDate,
      })
      .where(eq(config.userId, uuidToBin(userId)))

    revalidatePath('/settings')
    revalidatePath('/home')
    revalidatePath('/[userId]')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const addCalendar = async (newCalendar: {
  name: string
  url: string
}): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const userConfig = await db.query.config.findFirst({
      where: eq(config.userId, uuidToBin(userId)),
    })
    if (!userConfig) throw new Error('config not found')

    await db.insert(calendar).values({
      configId: userConfig.id,
      name: newCalendar.name,
      url: newCalendar.url,
    })

    revalidatePath('/settings')
    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const updateCalendar = async ({
  id,
  newCalendar,
}: {
  id: number
  newCalendar: { name: string }
}): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const userConfig = await db.query.config.findFirst({
      where: eq(config.userId, uuidToBin(userId)),
    })
    if (!userConfig) throw new Error('config not found')

    await db
      .update(calendar)
      .set({
        name: newCalendar.name,
      })
      .where(and(eq(calendar.configId, userConfig.id), eq(calendar.id, id)))

    revalidatePath('/settings')
    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const deleteCalendar = async (id: number): Promise<{ error?: true }> => {
  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    const userConfig = await db.query.config.findFirst({
      where: eq(config.userId, uuidToBin(userId)),
    })
    if (!userConfig) throw new Error('config not found')

    await db
      .delete(calendar)
      .where(and(eq(calendar.configId, userConfig.id), eq(calendar.id, id)))

    revalidatePath('/settings')
    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

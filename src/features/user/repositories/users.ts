'use server'

import { revalidatePath } from 'next/cache'
import { AuthUser, AuthUserWithConfig, User } from '../types/user'
import { SrcDuration } from '../constants/predictionSrcDurations'
import { createPrisma } from '@/libs/cachedPrisma'
import { log } from '@/libs/axiomLogger'
import {
  getAuthUserIdWithServerAction,
  getAuthUserIdWithServerComponent,
} from '@/utils/getAuthUserId'
import { Result } from '@/types/global'
import { encrypt } from '@/utils/crypto'

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
  const prisma = createPrisma()

  try {
    await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { id },
      })
      if (existingUser) return

      await tx.user.create({
        data: {
          id,
          nickname,
          email,
          avatarUrl,
          config: {
            create: {
              predictionSrcDurationRelation: {
                connect: { duration: 'month2' satisfies SrcDuration },
              },
            },
          },
        },
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
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const authUser = await prisma.user.findFirst({
      where: { id: userId },
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
  const prisma = createPrisma()

  try {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
      },
    })
    if (!user) throw new Error('user not found')

    return { user }
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const getAuthUserWithConfig = async (): Promise<
  Result<{ authUserWithConfig: AuthUserWithConfig }, true>
> => {
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    const authUserWithConfig = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        config: {
          include: { calendars: true },
        },
      },
    })
    if (!authUserWithConfig?.config) throw new Error('user not found')

    return {
      // こうしないとconfigがnullableと推論されてしまう
      authUserWithConfig: {
        ...authUserWithConfig,
        config: authUserWithConfig.config,
      },
    }
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
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerComponent()
    if (error) throw error

    await prisma.user.update({
      where: { id: userId },
      data: {
        nickname,
        newEmail,
        avatarUrl,
      },
    })

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
  const prisma = createPrisma()

  try {
    const result = await prisma.user.findFirst({
      where: { id: userId },
      select: { newEmail: true },
    })
    if (!result?.newEmail) throw new Error('newEmail not found')

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: result.newEmail,
        newEmail: null,
      },
    })

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
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await prisma.config.update({
      where: { userId },
      data: {
        predictionSrcDurationRelation: predictionSrcDuration
          ? {
              connect: {
                duration: predictionSrcDuration,
              },
            }
          : undefined,
        predictionSrcStartDate,
      },
    })

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
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await prisma.calendar.create({
      data: {
        name: newCalendar.name,
        url: newCalendar.url,
        config: {
          connect: { userId },
        },
      },
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
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await prisma.calendar.update({
      where: { id, config: { userId } },
      data: newCalendar,
    })

    revalidatePath('/settings')
    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const deleteCalendar = async (id: number): Promise<{ error?: true }> => {
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await prisma.calendar.delete({
      where: { id, config: { userId } },
    })

    revalidatePath('/settings')
    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

export const updateGoogleConfig = async ({
  rawGoogleRefreshToken,
  googleCalendarId,
}: {
  rawGoogleRefreshToken?: string | null
  googleCalendarId?: string | null
}): Promise<{ error?: true }> => {
  const prisma = createPrisma()

  try {
    const { userId, error } = await getAuthUserIdWithServerAction()
    if (error) throw error

    await prisma.config.update({
      where: { userId },
      data: {
        googleRefreshToken:
          typeof rawGoogleRefreshToken === 'string'
            ? await encrypt(rawGoogleRefreshToken)
            : rawGoogleRefreshToken, // nullかundefined
        googleCalendarId,
      },
    })

    revalidatePath('/settings')
    revalidatePath('/home')
    return {}
  } catch (e) {
    log.error(e)
    return { error: true }
  }
}

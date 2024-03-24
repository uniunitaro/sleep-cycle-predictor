import { db } from '@/db'
import { config, sleep, user } from '@/db/schema'
import { prisma } from '@/libs/prisma'
import { binToUuid } from '@/utils/uuid'

const migrate = async () => {
  const users = await db.query.user.findMany({
    extras: {
      stringId: binToUuid(user.id).as('stringId'),
    },
  })

  const configs = await db.query.config.findMany({
    extras: {
      stringUserId: binToUuid(config.userId).as('stringUserId'),
    },
  })

  const sleeps = await db.query.sleep.findMany({
    extras: {
      stringUserId: binToUuid(sleep.userId).as('stringUserId'),
    },
  })

  await prisma.user.deleteMany()
  await prisma.config.deleteMany()
  await prisma.sleep.deleteMany()

  await prisma.$transaction(
    users.map((user) =>
      prisma.user.create({
        data: {
          id: user.stringId,
          email: user.email!,
          newEmail: user.newEmail,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    )
  )

  await prisma.$transaction(
    configs.map((config) =>
      prisma.config.create({
        data: {
          id: config.id,
          userId: config.stringUserId,
          predictionSrcDuration: config.predictionSrcDuration,
          predictionSrcStartDate: config.predictionSrcStartDate,
          createdAt: config.createdAt,
          updatedAt: config.updatedAt,
        },
      })
    )
  )

  const sleepOfExistingUser = sleeps.filter((sleep) =>
    users.some((user) => user.stringId === sleep.stringUserId)
  )

  await prisma.$transaction(
    sleepOfExistingUser.map((sleep) =>
      prisma.sleep.create({
        data: {
          id: sleep.id,
          userId: sleep.stringUserId,
          start: sleep.start,
          end: sleep.end,
          parentSleepId: sleep.parentSleepId,
          createdAt: sleep.createdAt,
          updatedAt: sleep.updatedAt,
        },
      })
    )
  )
}

migrate()

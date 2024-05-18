import { Prisma } from '@prisma/client'
import { emails } from './constants'
import { createUncachedPrisma } from '@/libs/prisma'
import { SrcDuration } from '@/features/user/constants/predictionSrcDurations'

export const setupDatabase = async () => {
  const prisma = createUncachedPrisma()

  const userIds = await Promise.all(
    emails.map(async (email) => {
      const userData = await prisma.user.findFirst({
        where: { email },
      })

      if (!userData) throw new Error(`User not found: ${email}`)
      return userData.id
    })
  )

  // 1月1日から4日までの睡眠データを作成
  const sleepData: Omit<Prisma.SleepUncheckedCreateInput, 'userId'>[] = [
    {
      start: new Date('2023-01-01T00:00:00.000Z'),
      end: new Date('2023-01-01T08:00:00.000Z'),
    },
    {
      start: new Date('2023-01-02T01:00:00.000Z'),
      end: new Date('2023-01-02T09:00:00.000Z'),
    },
    {
      start: new Date('2023-01-03T02:00:00.000Z'),
      end: new Date('2023-01-03T10:00:00.000Z'),
    },
    {
      start: new Date('2023-01-04T03:00:00.000Z'),
      end: new Date('2023-01-04T11:00:00.000Z'),
    },
  ]

  for (const userId of userIds) {
    // すでにデータがある場合は削除
    await prisma.sleep.deleteMany({
      where: { userId },
    })

    await prisma.$transaction(
      sleepData.map((data) =>
        prisma.sleep.create({ data: { ...data, userId } })
      )
    )

    await prisma.user.update({
      data: { nickname: 'E2E太郎' },
      where: { id: userId },
    })
    await prisma.config.update({
      // homeでsleepsとpredictionsをテストするために10年に設定、詳細はhomeのテストファイル参照
      data: { predictionSrcDuration: 'year10' satisfies SrcDuration },
      where: { userId },
    })
  }
}

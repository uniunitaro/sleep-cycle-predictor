import { eq } from 'drizzle-orm'
import { PlanetScaleDatabase } from 'drizzle-orm/planetscale-serverless'
import { emails } from './constants'
import { db as _db } from './deps.bundle'
import * as schema from '@/db/schema'
import { NewSleep, sleep, user, config } from '@/db/schema'
import { binToUuid, uuidToBin } from '@/utils/uuid'

export const setupDatabase = async () => {
  const db = _db as unknown as PlanetScaleDatabase<typeof schema>

  const userIds = await Promise.all(
    emails.map(async (email) => {
      const userData = await db.query.user.findFirst({
        where: eq(user.email, email),
        extras: {
          stringId: binToUuid(user.id).as('stringId'),
        },
      })

      if (!userData) throw new Error(`User not found: ${email}`)
      return userData.stringId
    })
  )

  // 1月1日から4日までの睡眠データを作成
  const sleepData: Omit<NewSleep, 'userId'>[] = [
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
    await db.delete(sleep).where(eq(sleep.userId, uuidToBin(userId)))

    await db.insert(sleep).values(
      sleepData.map(
        (data) =>
          ({
            ...data,
            userId: uuidToBin(userId) as unknown as string,
          } satisfies NewSleep)
      )
    )

    // デフォルトデータをセット
    await db
      .update(user)
      .set({
        nickname: 'E2E太郎',
      })
      .where(eq(user.id, uuidToBin(userId)))
    await db
      .update(config)
      .set({
        // homeでsleepsとpredictionsをテストするために1年に設定、詳細はhomeのテストファイル参照
        predictionSrcDuration: 'year10',
      })
      .where(eq(config.userId, uuidToBin(userId)))
  }
}

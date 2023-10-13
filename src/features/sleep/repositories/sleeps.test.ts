import { addSleep, deleteSleep, getSleeps, updateSleep } from './sleeps'
import { db } from '@/db'
import { sleepFactory } from '@/libs/drizzleFactories'
import { uuidToBin } from '@/utils/uuid'

jest.mock('@/utils/getAuthUserId', () => ({
  getAuthUserIdWithServerAction: jest
    .fn()
    .mockResolvedValue({ userId: '2db90a08-7418-53c0-69dc-6bd37e968357' }),
  getAuthUserIdWithServerComponent: jest
    .fn()
    .mockResolvedValue({ userId: '2db90a08-7418-53c0-69dc-6bd37e968357' }),
}))
const userId = '2db90a08-7418-53c0-69dc-6bd37e968357'

const testCases = [
  [new Date('2022-01-01T02:00:00.000Z'), new Date('2022-01-01T06:00:00.000Z')],
  [new Date('2022-01-01T00:00:00.000Z'), new Date('2022-01-01T08:00:00.000Z')],
  [new Date('2022-01-01T00:00:00.000Z'), new Date('2022-01-01T04:00:00.000Z')],
  [new Date('2022-01-01T04:00:00.000Z'), new Date('2022-01-01T08:00:00.000Z')],
  [new Date('2022-01-01T04:00:00.000Z'), new Date('2022-01-01T06:00:00.000Z')],
  [new Date('2022-01-01T00:00:00.000Z'), new Date('2022-01-01T02:00:00.000Z')],
  [new Date('2022-01-01T06:00:00.000Z'), new Date('2022-01-01T08:00:00.000Z')],
]

describe('getSleeps', () => {
  test('指定した期間のSleepの配列が返される', async () => {
    const sleeps = [
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-02T08:00:00.000Z'),
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-03T00:00:00.000Z'),
        end: new Date('2022-01-03T08:00:00.000Z'),
      },
    ] satisfies Parameters<typeof sleepFactory.create>[0]
    await sleepFactory.create(sleeps)

    const payload = {
      start: new Date('2022-01-02T00:00:00.000Z'),
      end: new Date('2022-01-03T00:00:00.000Z'),
    }

    const { sleeps: result } = await getSleeps(payload)
    expect(result).toHaveLength(1)
    expect(result?.[0].sleeps[0].start).toEqual(sleeps[1].start)
    expect(result?.[0].sleeps[0].end).toEqual(sleeps[1].end)
  })

  test('SleepとSegmentedSleepをまとめた配列が返される', async () => {
    const sleeps = [
      {
        id: 100,
        userId: uuidToBin(userId),
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-02T08:00:00.000Z'),
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-02T10:00:00.000Z'),
        end: new Date('2022-01-02T11:00:00.000Z'),
        parentSleepId: 100,
      },
    ] satisfies Parameters<typeof sleepFactory.create>[0]
    await sleepFactory.create(sleeps)

    const payload = {
      start: new Date('2022-01-02T00:00:00.000Z'),
      end: new Date('2022-01-03T00:00:00.000Z'),
    }

    const { sleeps: result } = await getSleeps(payload)
    expect(result).toHaveLength(1)
    expect(result?.[0].sleeps).toHaveLength(2)
    expect(result?.[0].sleeps[0].start).toEqual(sleeps[0].start)
    expect(result?.[0].sleeps[0].end).toEqual(sleeps[0].end)

    expect(result?.[0].sleeps[1].start).toEqual(sleeps[1].start)
    expect(result?.[0].sleeps[1].end).toEqual(sleeps[1].end)
  })

  test('昇順で返される', async () => {
    // 降順に並べている
    const sleeps = [
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-03T00:00:00.000Z'),
        end: new Date('2022-01-03T08:00:00.000Z'),
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-02T08:00:00.000Z'),
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
    ] satisfies Parameters<typeof sleepFactory.create>[0]
    await sleepFactory.create(sleeps)

    const payload = {
      start: new Date('2022-01-01T00:00:00.000Z'),
      end: new Date('2022-01-04T00:00:00.000Z'),
    }

    const { sleeps: result } = await getSleeps(payload)
    expect(result).toHaveLength(3)
    expect(result?.[0].sleeps[0].start).toEqual(sleeps[2].start)
    expect(result?.[0].sleeps[0].end).toEqual(sleeps[2].end)
    expect(result?.[1].sleeps[0].start).toEqual(sleeps[1].start)
    expect(result?.[1].sleeps[0].end).toEqual(sleeps[1].end)
    expect(result?.[2].sleeps[0].start).toEqual(sleeps[0].start)
    expect(result?.[2].sleeps[0].end).toEqual(sleeps[0].end)
  })
})

describe('addSleep', () => {
  test('Sleepレコードが作成される', async () => {
    const sleeps = [
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T10:00:00.000Z'),
        end: new Date('2022-01-01T11:00:00.000Z'),
      },
    ]

    await addSleep(sleeps)
    const sleep = await db.query.sleep.findFirst({
      with: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[0].start)
    expect(sleep?.end).toEqual(sleeps[0].end)

    expect(sleep?.segmentedSleeps).toHaveLength(1)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
  })

  test('リクエストのSleepsが昇順に並び替えられて、最早のものがSleepに、それ以外がSegmentedSleepsとして作成される', async () => {
    const sleeps = [
      {
        start: new Date('2022-01-01T13:00:00.000Z'),
        end: new Date('2022-01-01T15:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T10:00:00.000Z'),
        end: new Date('2022-01-01T11:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
    ]

    await addSleep(sleeps)
    const sleep = await db.query.sleep.findFirst({
      with: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[2].start)
    expect(sleep?.end).toEqual(sleeps[2].end)

    expect(sleep?.segmentedSleeps).toHaveLength(2)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
    expect(sleep?.segmentedSleeps[1].start).toEqual(sleeps[0].start)
    expect(sleep?.segmentedSleeps[1].end).toEqual(sleeps[0].end)
  })

  describe('Sleepが既存のSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await sleepFactory.create({
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [{ start, end }]
      const { error } = await addSleep(sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('Sleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await sleepFactory.create([
        {
          id: 1,
          userId: uuidToBin(userId),
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        {
          userId: uuidToBin(userId),
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
          parentSleepId: 1,
        },
      ])

      const sleeps = [{ start, end }]
      const { error } = await addSleep(sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await sleepFactory.create({
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await addSleep(sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await sleepFactory.create([
        {
          id: 1,
          userId: uuidToBin(userId),
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        {
          userId: uuidToBin(userId),
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
          parentSleepId: 1,
        },
      ])

      const sleeps = [
        {
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await addSleep(sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('リクエスト内で重複する場合はoverlapInRequestエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await addSleep(sleeps)
      expect(error).toEqual({ type: 'overlapInRequest' })
    })
  })
})

describe('updateSleep', () => {
  test('Sleepレコードが更新される', async () => {
    const originalSleepId = 1
    await sleepFactory.create({
      userId: uuidToBin(userId),
      id: originalSleepId,
    })

    const sleeps = [
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T10:00:00.000Z'),
        end: new Date('2022-01-01T11:00:00.000Z'),
      },
    ]

    await updateSleep(originalSleepId, sleeps)
    const sleep = await db.query.sleep.findFirst({
      with: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[0].start)
    expect(sleep?.end).toEqual(sleeps[0].end)

    expect(sleep?.segmentedSleeps).toHaveLength(1)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
  })

  test('SegmentedSleepを含むSleepレコードが更新される', async () => {
    const originalSleepId = 1
    await sleepFactory.create([
      { userId: uuidToBin(userId), id: originalSleepId },
      { userId: uuidToBin(userId), parentSleepId: originalSleepId },
    ])

    const sleeps = [
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T10:00:00.000Z'),
        end: new Date('2022-01-01T11:00:00.000Z'),
      },
    ]

    await updateSleep(originalSleepId, sleeps)
    const sleep = await db.query.sleep.findFirst({
      with: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[0].start)
    expect(sleep?.end).toEqual(sleeps[0].end)

    expect(sleep?.segmentedSleeps).toHaveLength(1)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
  })

  test('リクエストのSleepsが昇順に並び替えられて、最早のものがSleepに、それ以外がSegmentedSleepsとして作成される', async () => {
    const originalSleepId = 1
    await sleepFactory.create({
      userId: uuidToBin(userId),
      id: originalSleepId,
    })

    const sleeps = [
      {
        start: new Date('2022-01-01T13:00:00.000Z'),
        end: new Date('2022-01-01T15:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T10:00:00.000Z'),
        end: new Date('2022-01-01T11:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
    ]

    await updateSleep(originalSleepId, sleeps)
    const sleep = await db.query.sleep.findFirst({
      with: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[2].start)
    expect(sleep?.end).toEqual(sleeps[2].end)

    expect(sleep?.segmentedSleeps).toHaveLength(2)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
    expect(sleep?.segmentedSleeps[1].start).toEqual(sleeps[0].start)
    expect(sleep?.segmentedSleeps[1].end).toEqual(sleeps[0].end)
  })

  describe('Sleepが既存のSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const originalSleepId = 1
      await sleepFactory.create({
        userId: uuidToBin(userId),
        id: originalSleepId,
      })

      await sleepFactory.create({
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [{ start, end }]
      const { error } = await updateSleep(originalSleepId, sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('Sleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const originalSleepId = 1
      await sleepFactory.create({
        userId: uuidToBin(userId),
        id: originalSleepId,
      })

      await sleepFactory.create([
        {
          id: 100,
          userId: uuidToBin(userId),
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        {
          userId: uuidToBin(userId),
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
          parentSleepId: 100,
        },
      ])

      const sleeps = [{ start, end }]
      const { error } = await updateSleep(originalSleepId, sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const originalSleepId = 1
      await sleepFactory.create({
        userId: uuidToBin(userId),
        id: originalSleepId,
      })

      await sleepFactory.create({
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await updateSleep(originalSleepId, sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const originalSleepId = 1
      await sleepFactory.create({
        userId: uuidToBin(userId),
        id: originalSleepId,
      })

      await sleepFactory.create([
        {
          id: 100,
          userId: uuidToBin(userId),
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        {
          userId: uuidToBin(userId),
          start: new Date('2022-01-01T02:00:00.000Z'),
          end: new Date('2022-01-01T06:00:00.000Z'),
          parentSleepId: 100,
        },
      ])

      const sleeps = [
        {
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await updateSleep(originalSleepId, sleeps)
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('リクエスト内で重複する場合はoverlapInRequestエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const originalSleepId = 1
      await sleepFactory.create({
        userId: uuidToBin(userId),
        id: originalSleepId,
      })

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await updateSleep(originalSleepId, sleeps)
      expect(error).toEqual({ type: 'overlapInRequest' })
    })
  })

  describe('更新前のSleepと重複する場合に誤ってエラーが返されない', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const originalSleepId = 1
      await sleepFactory.create({
        userId: uuidToBin(userId),
        id: originalSleepId,
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [{ start, end }]
      const { error } = await updateSleep(originalSleepId, sleeps)
      expect(error).toBeUndefined()
    })
  })
})

describe('deleteSleep', () => {
  test('Sleepレコードが削除される', async () => {
    const sleepId = 1
    await sleepFactory.create({ userId: uuidToBin(userId), id: sleepId })

    await deleteSleep(sleepId)
    const sleeps = await db.query.sleep.findMany()
    expect(sleeps).toHaveLength(0)
  })

  test('SegmentedSleepを含むSleepレコードがすべて削除される', async () => {
    const sleepId = 1
    await sleepFactory.create([
      { userId: uuidToBin(userId), id: sleepId },
      { userId: uuidToBin(userId), parentSleepId: sleepId },
    ])

    await deleteSleep(sleepId)
    const sleeps = await db.query.sleep.findMany()
    expect(sleeps).toHaveLength(0)
  })
})

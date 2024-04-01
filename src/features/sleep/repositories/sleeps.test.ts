import { addSleep, deleteSleep, getSleeps, updateSleep } from './sleeps'
import { defineSleepFactory } from '@/src/__generated__/fabbrica'
import { UserFactory } from '@/libs/factories'
import { createPrisma } from '@/libs/prisma'

jest.mock('@/utils/getAuthUserId', () => ({
  getAuthUserIdWithServerAction: jest
    .fn()
    .mockResolvedValue({ userId: 'test' }),
  getAuthUserIdWithServerComponent: jest
    .fn()
    .mockResolvedValue({ userId: 'test' }),
}))
const userId = 'test'

const testCases = [
  [new Date('2022-01-01T02:00:00.000Z'), new Date('2022-01-01T06:00:00.000Z')],
  [new Date('2022-01-01T00:00:00.000Z'), new Date('2022-01-01T08:00:00.000Z')],
  [new Date('2022-01-01T00:00:00.000Z'), new Date('2022-01-01T04:00:00.000Z')],
  [new Date('2022-01-01T04:00:00.000Z'), new Date('2022-01-01T08:00:00.000Z')],
  [new Date('2022-01-01T04:00:00.000Z'), new Date('2022-01-01T06:00:00.000Z')],
  [new Date('2022-01-01T00:00:00.000Z'), new Date('2022-01-01T02:00:00.000Z')],
  [new Date('2022-01-01T06:00:00.000Z'), new Date('2022-01-01T08:00:00.000Z')],
]

const SleepFactory = defineSleepFactory({
  defaultData: {
    user: {
      connect: {
        id: userId,
      },
    },
  },
})

const prisma = createPrisma()

beforeEach(async () => {
  UserFactory.create({ id: userId })
})

describe('getSleeps', () => {
  test('指定した期間のSleepの配列が返される', async () => {
    const sleeps = await SleepFactory.createList([
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-02T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-03T00:00:00.000Z'),
        end: new Date('2022-01-03T08:00:00.000Z'),
      },
    ])

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
    const sleep = await SleepFactory.create({
      start: new Date('2022-01-02T00:00:00.000Z'),
      end: new Date('2022-01-02T08:00:00.000Z'),
    })
    const segmentedSleep = await SleepFactory.create({
      parentSleep: { connect: { id: sleep.id } },
      start: new Date('2022-01-02T10:00:00.000Z'),
      end: new Date('2022-01-02T11:00:00.000Z'),
    })

    const payload = {
      start: new Date('2022-01-02T00:00:00.000Z'),
      end: new Date('2022-01-03T00:00:00.000Z'),
    }

    const { sleeps: result } = await getSleeps(payload)
    expect(result).toHaveLength(1)
    expect(result?.[0].sleeps).toHaveLength(2)
    expect(result?.[0].sleeps[0].start).toEqual(sleep.start)
    expect(result?.[0].sleeps[0].end).toEqual(sleep.end)

    expect(result?.[0].sleeps[1].start).toEqual(segmentedSleep.start)
    expect(result?.[0].sleeps[1].end).toEqual(segmentedSleep.end)
  })

  test('昇順で返される', async () => {
    // 降順に並べている
    const sleeps = await SleepFactory.createList([
      {
        start: new Date('2022-01-03T00:00:00.000Z'),
        end: new Date('2022-01-03T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-02T00:00:00.000Z'),
        end: new Date('2022-01-02T08:00:00.000Z'),
      },
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
      },
    ])

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

    await addSleep({ sleeps })
    const sleep = await prisma.sleep.findFirst({
      include: { segmentedSleeps: true },
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

    await addSleep({ sleeps })
    const sleep = await prisma.sleep.findFirst({
      include: { segmentedSleeps: true },
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
      await SleepFactory.create({
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [{ start, end }]
      const { error } = await addSleep({ sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('Sleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await SleepFactory.create({
        start: new Date('2021-12-01T00:00:00.000Z'),
        end: new Date('2021-12-01T08:00:00.000Z'),
        segmentedSleeps: {
          create: [
            {
              userId,
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            },
          ],
        },
      })

      const sleeps = [{ start, end }]
      const { error } = await addSleep({ sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await SleepFactory.create({
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
      const { error } = await addSleep({ sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      await SleepFactory.create({
        start: new Date('2021-12-01T00:00:00.000Z'),
        end: new Date('2021-12-01T08:00:00.000Z'),
        segmentedSleeps: {
          create: [
            {
              userId,
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            },
          ],
        },
      })

      const sleeps = [
        {
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await addSleep({ sleeps })
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
      const { error } = await addSleep({ sleeps })
      expect(error).toEqual({ type: 'overlapInRequest' })
    })
  })

  describe('8時間以内に既存の睡眠が存在する場合はshortIntervalエラーが返される', () => {
    test.each(testCases)(
      '既存のendとリクエストのstartのパターン start: %p, end: %p',
      async (start, end) => {
        await SleepFactory.create({
          start: new Date('2021-12-31T12:00:00.000Z'),
          end: new Date('2021-12-31T22:00:00.000Z'),
        })

        const sleeps = [{ start, end }]
        const { error } = await addSleep({ sleeps })
        expect(error).toEqual({ type: 'shortInterval' })
      }
    )

    test.each(testCases)(
      '既存のstartとリクエストのendのパターンstart: %p, end: %p',
      async (start, end) => {
        await SleepFactory.create({
          start: new Date('2022-01-01T10:00:00.000Z'),
          end: new Date('2022-01-01T22:00:00.000Z'),
        })

        const sleeps = [{ start, end }]
        const { error } = await addSleep({ sleeps })
        expect(error).toEqual({ type: 'shortInterval' })
      }
    )

    test('8時間以上の場合はエラーが発生しない', async () => {
      await SleepFactory.create({
        start: new Date('2022-01-01T22:00:00.000Z'),
        end: new Date('2022-01-01T23:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
      ]
      const { error } = await addSleep({ sleeps })
      expect(error).toBeUndefined()
    })

    test('ignoreShortIntervalがtrueの場合はエラーが発生しない', async () => {
      await SleepFactory.create({
        start: new Date('2021-12-31T12:00:00.000Z'),
        end: new Date('2021-12-31T22:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
      ]
      const { error } = await addSleep({ sleeps, ignoreShortInterval: true })
      expect(error).toBeUndefined()
    })
  })
})

describe('updateSleep', () => {
  test('Sleepレコードが更新される', async () => {
    const { id: originalSleepId } = await SleepFactory.create()

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

    await updateSleep({ id: originalSleepId, sleeps })
    const sleep = await prisma.sleep.findFirst({
      include: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[0].start)
    expect(sleep?.end).toEqual(sleeps[0].end)

    expect(sleep?.segmentedSleeps).toHaveLength(1)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
  })

  test('SegmentedSleepを含むSleepレコードが更新される', async () => {
    const { id: originalSleepId } = await SleepFactory.create({
      segmentedSleeps: { create: await SleepFactory.build() },
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

    await updateSleep({ id: originalSleepId, sleeps })
    const sleep = await prisma.sleep.findFirst({
      include: { segmentedSleeps: true },
    })

    expect(sleep?.start).toEqual(sleeps[0].start)
    expect(sleep?.end).toEqual(sleeps[0].end)

    expect(sleep?.segmentedSleeps).toHaveLength(1)
    expect(sleep?.segmentedSleeps[0].start).toEqual(sleeps[1].start)
    expect(sleep?.segmentedSleeps[0].end).toEqual(sleeps[1].end)
  })

  test('リクエストのSleepsが昇順に並び替えられて、最早のものがSleepに、それ以外がSegmentedSleepsとして作成される', async () => {
    const { id: originalSleepId } = await SleepFactory.create()

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

    await updateSleep({ id: originalSleepId, sleeps })
    const sleep = await prisma.sleep.findFirst({
      include: { segmentedSleeps: true },
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
      const { id: originalSleepId } = await SleepFactory.create()

      await SleepFactory.create({
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [{ start, end }]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('Sleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const { id: originalSleepId } = await SleepFactory.create()

      await SleepFactory.create({
        start: new Date('2021-12-01T00:00:00.000Z'),
        end: new Date('2021-12-01T08:00:00.000Z'),
        segmentedSleeps: {
          create: [
            {
              userId,
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            },
          ],
        },
      })

      const sleeps = [{ start, end }]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const { id: originalSleepId } = await SleepFactory.create()

      await SleepFactory.create({
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
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('SegmentedSleepが既存のSegmentedSleepと重複する場合はoverlapWithRecordedエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const { id: originalSleepId } = await SleepFactory.create()

      await SleepFactory.create({
        start: new Date('2021-12-01T00:00:00.000Z'),
        end: new Date('2021-12-01T08:00:00.000Z'),
        segmentedSleeps: {
          create: [
            {
              userId,
              start: new Date('2022-01-01T02:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            },
          ],
        },
      })

      const sleeps = [
        {
          start: new Date('2021-12-01T00:00:00.000Z'),
          end: new Date('2021-12-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toEqual({ type: 'overlapWithRecorded' })
    })
  })

  describe('リクエスト内で重複する場合はoverlapInRequestエラーが返される', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const { id: originalSleepId } = await SleepFactory.create()

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
        { start, end },
      ]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toEqual({ type: 'overlapInRequest' })
    })
  })

  describe('更新前のSleepと重複する場合に誤ってエラーが返されない', () => {
    test.each(testCases)('start: %p, end: %p', async (start, end) => {
      const { id: originalSleepId } = await SleepFactory.create({
        start: new Date('2022-01-01T02:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
      })

      const sleeps = [{ start, end }]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toBeUndefined()
    })
  })

  describe('8時間以内に既存の睡眠が存在する場合はshortIntervalエラーが返される', () => {
    test.each(testCases)(
      '既存のendとリクエストのstartのパターン start: %p, end: %p',
      async (start, end) => {
        const { id: originalSleepId } = await SleepFactory.create()

        await SleepFactory.create({
          start: new Date('2021-12-31T12:00:00.000Z'),
          end: new Date('2021-12-31T22:00:00.000Z'),
        })

        const sleeps = [{ start, end }]
        const { error } = await updateSleep({ id: originalSleepId, sleeps })
        expect(error).toEqual({ type: 'shortInterval' })
      }
    )

    test.each(testCases)(
      '既存のstartとリクエストのendのパターンstart: %p, end: %p',
      async (start, end) => {
        const { id: originalSleepId } = await SleepFactory.create()

        await SleepFactory.create({
          start: new Date('2022-01-01T10:00:00.000Z'),
          end: new Date('2022-01-01T22:00:00.000Z'),
        })

        const sleeps = [{ start, end }]
        const { error } = await updateSleep({ id: originalSleepId, sleeps })
        expect(error).toEqual({ type: 'shortInterval' })
      }
    )

    test('8時間以上の場合はエラーが発生しない', async () => {
      const { id: originalSleepId } = await SleepFactory.create()

      await SleepFactory.create({
        start: new Date('2022-01-01T22:00:00.000Z'),
        end: new Date('2022-01-01T23:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
      ]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toBeUndefined()
    })

    test('ignoreShortIntervalがtrueの場合はエラーが発生しない', async () => {
      const { id: originalSleepId } = await SleepFactory.create()

      await SleepFactory.create({
        start: new Date('2021-12-31T12:00:00.000Z'),
        end: new Date('2021-12-31T22:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
      ]
      const { error } = await updateSleep({
        id: originalSleepId,
        sleeps,
        ignoreShortInterval: true,
      })
      expect(error).toBeUndefined()
    })

    test('更新前のSleepが8時間以内に存在するときに誤ってエラーが返されない', async () => {
      const { id: originalSleepId } = await SleepFactory.create({
        start: new Date('2022-01-01T10:00:00.000Z'),
        end: new Date('2022-01-01T22:00:00.000Z'),
      })

      const sleeps = [
        {
          start: new Date('2022-01-01T00:00:00.000Z'),
          end: new Date('2022-01-01T08:00:00.000Z'),
        },
      ]
      const { error } = await updateSleep({ id: originalSleepId, sleeps })
      expect(error).toBeUndefined()
    })
  })
})

describe('deleteSleep', () => {
  test('Sleepレコードが削除される', async () => {
    const { id: sleepId } = await SleepFactory.create()

    await deleteSleep(sleepId)
    const sleeps = await prisma.sleep.findMany()
    expect(sleeps).toHaveLength(0)
  })

  test('SegmentedSleepを含むSleepレコードがすべて削除される', async () => {
    const { id: sleepId } = await SleepFactory.create({
      segmentedSleeps: { create: await SleepFactory.build() },
    })

    await deleteSleep(sleepId)
    const sleeps = await prisma.sleep.findMany()
    expect(sleeps).toHaveLength(0)
  })
})

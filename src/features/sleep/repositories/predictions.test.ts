import { getMyPredictions, getPredictions } from './predictions'
import {
  configFactory,
  sleepFactory,
  userFactory,
} from '@/libs/drizzleFactories'
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

jest.mock('../utils/getSrcStart', () => ({
  getSrcStart: jest.fn().mockReturnValue(new Date('2022-01-01T00:00:00.000Z')),
}))

beforeEach(async () => {
  await userFactory.create({
    id: uuidToBin(userId),
  })
  await configFactory.create({
    userId: uuidToBin(userId),
  })
})

const testCases = [
  {
    userId: uuidToBin(userId),
    start: new Date('2022-01-01T00:00:00.000Z'),
    end: new Date('2022-01-01T08:00:00.000Z'),
  },
  {
    userId: uuidToBin(userId),
    start: new Date('2022-01-02T01:00:00.000Z'),
    end: new Date('2022-01-02T09:00:00.000Z'),
  },
  {
    userId: uuidToBin(userId),
    start: new Date('2022-01-03T02:00:00.000Z'),
    end: new Date('2022-01-03T10:00:00.000Z'),
  },
] satisfies Parameters<typeof sleepFactory.create>[0]

describe('getMyPredictions', () => {
  test('予測睡眠データの配列が返される', async () => {
    await sleepFactory.create(testCases)

    const payload = {
      start: new Date('2022-01-04T00:00:00.000Z'),
      end: new Date('2022-01-05T00:00:00.000Z'),
    }

    const { predictions: result } = await getMyPredictions(payload)
    expect(result?.[0].start).toEqual(new Date('2022-01-04T03:00:00.000Z'))
    expect(result?.[0].end).toEqual(new Date('2022-01-04T11:00:00.000Z'))
  })

  test('segmentedSleepsがあるとき', async () => {
    const sleeps = [
      {
        id: 100,
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T02:00:00.000Z'),
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T06:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
        parentSleepId: 100,
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T04:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
        parentSleepId: 100,
      },

      testCases[1],
      testCases[2],
    ] satisfies Parameters<typeof sleepFactory.create>[0]
    await sleepFactory.create(sleeps)

    const payload = {
      start: new Date('2022-01-04T00:00:00.000Z'),
      end: new Date('2022-01-05T00:00:00.000Z'),
    }

    const { predictions: result } = await getMyPredictions(payload)
    expect(result?.[0].start).toEqual(new Date('2022-01-04T03:00:00.000Z'))
    expect(result?.[0].end).toEqual(new Date('2022-01-04T11:00:00.000Z'))
  })

  test('降順でsleepレコードが存在していても適切に予測される', async () => {
    const sleeps = [
      testCases[2],
      testCases[1],
      {
        id: 100,
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T02:00:00.000Z'),
      },

      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T04:00:00.000Z'),
        end: new Date('2022-01-01T06:00:00.000Z'),
        parentSleepId: 100,
      },
      {
        userId: uuidToBin(userId),
        start: new Date('2022-01-01T06:00:00.000Z'),
        end: new Date('2022-01-01T08:00:00.000Z'),
        parentSleepId: 100,
      },
    ] satisfies Parameters<typeof sleepFactory.create>[0]
    await sleepFactory.create(sleeps)

    const payload = {
      start: new Date('2022-01-04T00:00:00.000Z'),
      end: new Date('2022-01-05T00:00:00.000Z'),
    }

    const { predictions: result } = await getMyPredictions(payload)
    expect(result?.[0].start).toEqual(new Date('2022-01-04T03:00:00.000Z'))
    expect(result?.[0].end).toEqual(new Date('2022-01-04T11:00:00.000Z'))
  })
})

describe('getPredictions', () => {
  test('予測睡眠データの配列が返される', async () => {
    await sleepFactory.create(testCases)

    const payload = {
      userId,
      start: new Date('2022-01-04T00:00:00.000Z'),
      end: new Date('2022-01-05T00:00:00.000Z'),
    }

    const { predictions: result } = await getPredictions(payload)
    expect(result?.[0].start).toEqual(new Date('2022-01-04T03:00:00.000Z'))
    expect(result?.[0].end).toEqual(new Date('2022-01-04T11:00:00.000Z'))

    expect(result).toHaveLength(1)
  })
})

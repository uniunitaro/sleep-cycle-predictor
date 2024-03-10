import { getMyPredictions, getPredictions } from './predictions'
import { ConfigFactory, UserFactory } from '@/libs/factories'
import { defineSleepFactory } from '@/src/__generated__/fabbrica'

jest.mock('@/utils/getAuthUserId', () => ({
  getAuthUserIdWithServerAction: jest
    .fn()
    .mockResolvedValue({ userId: 'test' }),
  getAuthUserIdWithServerComponent: jest
    .fn()
    .mockResolvedValue({ userId: 'test' }),
}))
const userId = 'test'

jest.mock('../utils/getSrcStart', () => ({
  getSrcStart: jest.fn().mockReturnValue(new Date('2022-01-01T00:00:00.000Z')),
}))

const SleepFactory = defineSleepFactory({
  defaultData: {
    user: {
      connect: {
        id: userId,
      },
    },
  },
})

beforeEach(async () => {
  await UserFactory.create({ id: userId })
  await ConfigFactory.create({ user: { connect: { id: userId } } })
})

const testCases = [
  {
    start: new Date('2022-01-01T00:00:00.000Z'),
    end: new Date('2022-01-01T08:00:00.000Z'),
  },
  {
    start: new Date('2022-01-02T01:00:00.000Z'),
    end: new Date('2022-01-02T09:00:00.000Z'),
  },
  {
    start: new Date('2022-01-03T02:00:00.000Z'),
    end: new Date('2022-01-03T10:00:00.000Z'),
  },
] satisfies Parameters<typeof SleepFactory.createList>[0]

describe('getMyPredictions', () => {
  test('予測睡眠データの配列が返される', async () => {
    await SleepFactory.createList(testCases)

    const payload = {
      start: new Date('2022-01-04T00:00:00.000Z'),
      end: new Date('2022-01-05T00:00:00.000Z'),
    }

    const { predictions: result } = await getMyPredictions(payload)
    expect(result?.[0].start).toEqual(new Date('2022-01-04T03:00:00.000Z'))
    expect(result?.[0].end).toEqual(new Date('2022-01-04T11:00:00.000Z'))
  })

  test('segmentedSleepsがあるとき', async () => {
    await SleepFactory.createList([
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T04:00:00.000Z'),
        segmentedSleeps: {
          create: [
            {
              userId,
              start: new Date('2022-01-01T06:00:00.000Z'),
              end: new Date('2022-01-01T08:00:00.000Z'),
            },
            {
              userId,
              start: new Date('2022-01-01T04:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            },
          ],
        },
      },
      testCases[1],
      testCases[2],
    ])

    const payload = {
      start: new Date('2022-01-04T00:00:00.000Z'),
      end: new Date('2022-01-05T00:00:00.000Z'),
    }

    const { predictions: result } = await getMyPredictions(payload)
    expect(result?.[0].start).toEqual(new Date('2022-01-04T03:00:00.000Z'))
    expect(result?.[0].end).toEqual(new Date('2022-01-04T11:00:00.000Z'))
  })

  test('降順でsleepレコードが存在していても適切に予測される', async () => {
    await SleepFactory.createList([
      testCases[2],
      testCases[1],
      {
        start: new Date('2022-01-01T00:00:00.000Z'),
        end: new Date('2022-01-01T04:00:00.000Z'),
        segmentedSleeps: {
          create: [
            {
              userId,
              start: new Date('2022-01-01T04:00:00.000Z'),
              end: new Date('2022-01-01T06:00:00.000Z'),
            },
            {
              userId,
              start: new Date('2022-01-01T06:00:00.000Z'),
              end: new Date('2022-01-01T08:00:00.000Z'),
            },
          ],
        },
      },
    ])

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
    await SleepFactory.createList(testCases)

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

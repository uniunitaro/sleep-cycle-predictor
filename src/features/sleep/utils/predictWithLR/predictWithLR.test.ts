import { predictWithLR } from './predictWithLR'
import * as getOutlierSleeps from './getOutlierSleeps'
import { Sleep } from '@/db/schema'

jest.mock('./getOutlierSleeps', () => ({
  __esModule: true,
  ...jest.requireActual('./getOutlierSleeps'),
}))

const sleepTestCases: (Sleep & { segmentedSleeps: Sleep[] })[] = [
  {
    id: 1,
    start: new Date('2021-12-30T23:00:00.000Z'),
    end: new Date('2021-12-31T07:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 2,
    start: new Date('2022-01-01T00:00:00.000Z'),
    end: new Date('2022-01-01T08:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 3,
    start: new Date('2022-01-02T01:00:00.000Z'),
    end: new Date('2022-01-02T09:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 4,
    start: new Date('2022-01-03T02:00:00.000Z'),
    end: new Date('2022-01-03T10:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 5,
    start: new Date('2022-01-04T03:00:00.000Z'),
    end: new Date('2022-01-04T11:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 6,
    start: new Date('2022-01-05T04:00:00.000Z'),
    end: new Date('2022-01-05T12:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 7,
    start: new Date('2022-01-06T05:00:00.000Z'),
    end: new Date('2022-01-06T13:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
  {
    id: 8,
    start: new Date('2022-01-07T06:00:00.000Z'),
    end: new Date('2022-01-07T14:00:00.000Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    segmentedSleeps: [],
    parentSleepId: null,
  },
]

describe('predictWithLR', () => {
  test('指定した期間における予測された睡眠の配列が返される', () => {
    const expected = [
      {
        start: new Date('2022-01-08T07:00:00.000Z'),
        end: new Date('2022-01-08T15:00:00.000Z'),
      },
    ]
    const result = predictWithLR(
      sleepTestCases,
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )
    expect(result).toEqual(expected)

    const expected2 = [
      {
        start: new Date('2022-01-09T08:00:00.000Z'),
        end: new Date('2022-01-09T16:00:00.000Z'),
      },
    ]
    const result2 = predictWithLR(
      sleepTestCases,
      new Date('2022-01-09T00:00:00.000Z'),
      new Date('2022-01-10T00:00:00.000Z')
    )
    expect(result2).toEqual(expected2)
  })

  test('睡眠が1つ以下のときは空配列が返される', () => {
    const result = predictWithLR(
      [],
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )
    expect(result).toEqual([])

    const result2 = predictWithLR(
      [sleepTestCases[0]],
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )
    expect(result2).toEqual([])
  })

  test('startよりも後に睡眠が存在するときは、その睡眠の次の予測から返される', () => {
    const expected = [
      {
        start: new Date('2022-01-08T07:00:00.000Z'),
        end: new Date('2022-01-08T15:00:00.000Z'),
      },
    ]
    const result = predictWithLR(
      sleepTestCases,
      new Date('2022-01-07T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )
    expect(result).toEqual(expected)
  })

  test('予測された睡眠の終了時刻がstartより遅い睡眠だけが返される', () => {
    const expected = [
      {
        start: new Date('2022-01-08T07:00:00.000Z'),
        end: new Date('2022-01-08T15:00:00.000Z'),
      },
    ]
    const result = predictWithLR(
      sleepTestCases,
      new Date('2022-01-08T08:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )
    expect(result).toEqual(expected)

    const result2 = predictWithLR(
      sleepTestCases,
      new Date('2022-01-08T16:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )
    expect(result2).toEqual([])
  })

  test('SegmentedSleepがあるときは結合されて予測される', () => {
    const sleepWithSegmentedSleeps: (Sleep & {
      segmentedSleeps: Sleep[]
    })[] = sleepTestCases.map((sleep) =>
      sleep.id === 5
        ? {
            ...sleep,
            start: new Date('2022-01-04T03:00:00.000Z'),
            end: new Date('2022-01-04T05:00:00.000Z'),
            segmentedSleeps: [
              {
                id: 1,
                start: new Date('2022-01-04T09:00:00.000Z'),
                end: new Date('2022-01-04T11:00:00.000Z'),
                createdAt: new Date(),
                updatedAt: new Date(),
                parentSleepId: 4,
                userId: '1',
              },
            ],
          }
        : sleep
    )

    // 分割睡眠の日は睡眠時間が4時間のため予測される睡眠時間は短くなる
    const expected = [
      {
        start: new Date('2022-01-08T07:15:00.000Z'),
        end: new Date('2022-01-08T14:45:00.000Z'),
      },
    ]
    const result = predictWithLR(
      sleepWithSegmentedSleeps,
      new Date('2022-01-08T00:00:00.000Z'),
      new Date('2022-01-09T00:00:00.000Z')
    )

    expect(result).toEqual(expected)
  })

  describe('外れ値があるときは外れ値が補完されて予測される', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('外れ値が1つのとき', () => {
      const sleepWithOutlier = sleepTestCases.filter((sleep) => sleep.id !== 3)

      jest
        .spyOn(getOutlierSleeps, 'getOutlierSleeps')
        .mockReturnValue([{ id: 4, interpolationDays: 1 }])

      const expected = [
        {
          start: new Date('2022-01-08T07:00:00.000Z'),
          end: new Date('2022-01-08T15:00:00.000Z'),
        },
      ]

      const result = predictWithLR(
        sleepWithOutlier,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z')
      )
      expect(result).toEqual(expected)
    })

    test('外れ値が複数のとき', async () => {
      const sleepWithOutlier = sleepTestCases.filter(
        (sleep) => sleep.id !== 3 && sleep.id !== 6
      )

      jest.spyOn(getOutlierSleeps, 'getOutlierSleeps').mockReturnValue([
        { id: 4, interpolationDays: 1 },
        { id: 7, interpolationDays: 1 },
      ])

      const expected = [
        {
          start: new Date('2022-01-08T07:00:00.000Z'),
          end: new Date('2022-01-08T15:00:00.000Z'),
        },
      ]

      const result = predictWithLR(
        sleepWithOutlier,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z')
      )
      expect(result).toEqual(expected)
    })

    test('interpolationDaysが2のとき', async () => {
      const sleepWithOutlier = sleepTestCases.filter(
        (sleep) => sleep.id !== 4 && sleep.id !== 5
      )

      jest
        .spyOn(getOutlierSleeps, 'getOutlierSleeps')
        .mockReturnValue([{ id: 6, interpolationDays: 2 }])

      const expected = [
        {
          start: new Date('2022-01-08T07:00:00.000Z'),
          end: new Date('2022-01-08T15:00:00.000Z'),
        },
      ]

      const result = predictWithLR(
        sleepWithOutlier,
        new Date('2022-01-08T00:00:00.000Z'),
        new Date('2022-01-09T00:00:00.000Z')
      )
      expect(result).toEqual(expected)
    })
  })
})

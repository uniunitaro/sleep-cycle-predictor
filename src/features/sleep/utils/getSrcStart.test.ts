import { getSrcStart } from './getSrcStart'

describe('getSrcStart', () => {
  jest.useFakeTimers({
    doNotFake: ['nextTick'],
  })

  const mockDate = new Date('2022-01-01T03:00:00.000Z')
  jest.setSystemTime(mockDate)

  test('1週前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'week1',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-12-25T03:00:00.000Z'))
  })

  test('2週前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'week2',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-12-18T03:00:00.000Z'))
  })

  test('1ヶ月前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'month1',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-12-01T03:00:00.000Z'))
  })

  test('2ヶ月前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'month2',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-11-01T03:00:00.000Z'))
  })

  test('3ヶ月前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'month3',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-10-01T03:00:00.000Z'))
  })

  test('6ヶ月前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'month6',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-07-01T03:00:00.000Z'))
  })

  test('1年前のDateが返される', () => {
    const result = getSrcStart({
      predictionSrcDuration: 'year1',
      predictionSrcStartDate: null,
    })
    expect(result).toEqual(new Date('2021-01-01T03:00:00.000Z'))
  })
})

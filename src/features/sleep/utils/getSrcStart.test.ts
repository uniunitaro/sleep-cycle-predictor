import { getSrcStart } from './getSrcStart'

describe('getSrcStart', () => {
  jest.useFakeTimers({
    doNotFake: ['nextTick'],
  })

  const mockDate = new Date('2022-01-01T03:00:00.000Z')
  jest.setSystemTime(mockDate)

  test('1週前のDateが返される', () => {
    const result = getSrcStart('week1')
    expect(result).toEqual(new Date('2021-12-25T03:00:00.000Z'))
  })

  test('2週前のDateが返される', () => {
    const result = getSrcStart('week2')
    expect(result).toEqual(new Date('2021-12-18T03:00:00.000Z'))
  })

  test('1ヶ月前のDateが返される', () => {
    const result = getSrcStart('month1')
    expect(result).toEqual(new Date('2021-12-01T03:00:00.000Z'))
  })

  test('2ヶ月前のDateが返される', () => {
    const result = getSrcStart('month2')
    expect(result).toEqual(new Date('2021-11-01T03:00:00.000Z'))
  })

  test('3ヶ月前のDateが返される', () => {
    const result = getSrcStart('month3')
    expect(result).toEqual(new Date('2021-10-01T03:00:00.000Z'))
  })

  test('6ヶ月前のDateが返される', () => {
    const result = getSrcStart('month6')
    expect(result).toEqual(new Date('2021-07-01T03:00:00.000Z'))
  })

  test('1年前のDateが返される', () => {
    const result = getSrcStart('year1')
    expect(result).toEqual(new Date('2021-01-01T03:00:00.000Z'))
  })
})

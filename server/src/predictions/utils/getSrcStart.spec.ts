import { getSrcStart } from './getSrcStart'

describe('getSrcStart', () => {
  jest.useFakeTimers()

  // JSTでは"2022-01-02 01:00:00"になる
  const mockDate = new Date('2022-01-01T16:00:00.000Z')
  jest.setSystemTime(mockDate)

  test('JSTにおける1週前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('week1')
    expect(result).toEqual(new Date('2021-12-25T15:00:00.000Z'))
  })

  test('JSTにおける2週前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('week2')
    expect(result).toEqual(new Date('2021-12-18T15:00:00.000Z'))
  })

  test('JSTにおける1ヶ月前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('month1')
    expect(result).toEqual(new Date('2021-12-01T15:00:00.000Z'))
  })

  test('JSTにおける2ヶ月前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('month2')
    expect(result).toEqual(new Date('2021-11-01T15:00:00.000Z'))
  })

  test('JSTにおける3ヶ月前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('month3')
    expect(result).toEqual(new Date('2021-10-01T15:00:00.000Z'))
  })

  test('JSTにおける6ヶ月前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('month6')
    expect(result).toEqual(new Date('2021-07-01T15:00:00.000Z'))
  })

  test('JSTにおける1年前の00:00のDateがUTCで返される', async () => {
    const result = await getSrcStart('year1')
    expect(result).toEqual(new Date('2021-01-01T15:00:00.000Z'))
  })
})

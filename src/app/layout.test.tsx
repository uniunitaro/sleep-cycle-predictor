import { runtime } from './layout'

jest.mock('next/font/google', () => ({
  Noto_Sans_JP: jest.fn(),
  Roboto: jest.fn(),
}))

test('runtimeがedgeに設定されている', () => {
  expect(runtime).toBe('edge')
})

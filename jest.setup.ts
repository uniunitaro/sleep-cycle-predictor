import '@testing-library/jest-dom'

jest.mock('next/cache')
jest.mock('next/navigation')

jest.mock('@/features/auth/components/GoogleLogo')
jest.mock('@/features/auth/components/XLogo')

jest.mock('@/libs/cachedPrisma', () => {
  return {
    createPrisma: () => jestPrisma.client,
  }
})

import '@testing-library/jest-dom'

jest.mock('next/cache')
jest.mock('next/navigation')

jest.mock('@/features/auth/components/GoogleLogo')
jest.mock('@/features/auth/components/XLogo')

jest.mock('@/libs/prisma', () => {
  return {
    createPrisma: () => jestPrisma.client,
  }
})

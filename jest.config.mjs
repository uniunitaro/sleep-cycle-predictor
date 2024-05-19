import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  // transform: {
  //   '^.+\\.(t|j)sx?$': [
  //     '@swc/jest',
  //     {
  //       jsc: {
  //         transform: {
  //           react: {
  //             runtime: 'automatic',
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@cloudflare/next-on-pages$': '<rootDir>/src/mocks/next-on-pages.ts',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '@quramy/prisma-fabbrica/scripts/jest-prisma',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  testEnvironment: '@quramy/jest-prisma/environment',
  testEnvironmentOptions: {
    customExportConditions: ['browser', 'node'],
  },
}

export default createJestConfig(config)

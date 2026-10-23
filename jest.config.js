const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  // ts-jest 29+ dropped the `globals['ts-jest']` config and the `ts-jest`
  // preset's automatic tsconfig wiring. Use the explicit transform form
  // instead. The key matches next/jest's default SWC transform so this
  // overrides it (next/jest spreads custom `transform` last).
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}

module.exports = createJestConfig(customJestConfig)

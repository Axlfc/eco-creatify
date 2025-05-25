
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/src/api/__tests__/**/*.test.ts',
    '!**/src/api/__tests__/treasury.e2e.test.ts' // Exclude treasury tests that might have blockchain deps
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testTimeout: 5000,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts']
};

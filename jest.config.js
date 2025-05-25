
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  testMatch: [
    '**/?(*.)+(spec|test).[jt]s?(x)',
    '!**/test/Governance.test.skip.ts' // Exclude the problematic blockchain test
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/main.tsx',
    '!src/did-community-demo.ts', // Exclude blockchain demo
    '!src/api/treasury.ts' // Exclude treasury that might have blockchain deps
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  testTimeout: 10000,
  // Ignore problematic directories that might have blockchain dependencies
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/artifacts/',
    '/cache/',
    '/typechain-types/'
  ]
};

/** @type {import('jest').Config} */
export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/test/**/*.test.ts'],

  transform: {
    '.*\\.(tsx?|js)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Disable type checking for tests
        isolatedModules: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
}

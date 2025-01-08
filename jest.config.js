module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    setupFiles: ['./jest.setup.ts'],
  };

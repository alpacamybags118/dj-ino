module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/config/ioc.config.ts'],
  roots: ['./tests/src'],
}
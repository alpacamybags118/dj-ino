module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./src/config/ioc.config.ts', 'dotenv/config'],
  roots: ['./tests/integration'],
  }
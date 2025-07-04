export default {
  files: ['src/**/*.test.ts', 'test/**/*.ts'],
  extensions: ['ts'],
  require: ['tsx/register'],
  timeout: '2m',
  concurrency: 4,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true,
  environmentVariables: {
    NODE_ENV: 'test',
  },
}; 
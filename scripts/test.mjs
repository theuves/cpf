import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

if (Number(process.versions.node.split('.')[0]) < 24) {
  throw new Error('Development commands require Node.js 24 or newer.')
}

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const coverage = process.argv.includes('--coverage')
const watch = process.argv.includes('--watch')
const compilerArgs = [
  'node_modules/typescript/bin/tsc',
  '-p',
  'tsconfig.runner.json',
]
const options = {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'test' },
}

rmSync(new URL('../.test-build/', import.meta.url), {
  recursive: true,
  force: true,
})
const compilation = spawnSync(process.execPath, compilerArgs, options)
if (compilation.error) throw compilation.error
if (compilation.status !== 0) process.exit(compilation.status ?? 1)

const args = ['--test', '--test-concurrency=4', '--test-timeout=120000']
if (watch) args.push('--watch')
if (coverage) {
  mkdirSync(new URL('../coverage/', import.meta.url), { recursive: true })
  args.push(
    '--experimental-test-coverage',
    '--import=./scripts/test-coverage-setup.mjs',
    '--test-coverage-include=.test-build/**/*.js',
    '--test-coverage-exclude=**/*.test.js',
    '--test-coverage-exclude=**/index.js',
    '--test-coverage-exclude=**/spec.js',
    '--test-coverage-exclude=.test-build/core/types.js',
    '--test-coverage-exclude=.test-build/browser.js',
    '--test-coverage-lines=100',
    '--test-coverage-branches=100',
    '--test-coverage-functions=100',
    '--test-reporter=spec',
    '--test-reporter-destination=stdout',
    '--test-reporter=lcov',
    '--test-reporter-destination=coverage/lcov.info'
  )
}
args.push('.test-build/**/*.test.js')

const compiler = watch
  ? spawn(
      process.execPath,
      [...compilerArgs, '--watch', '--preserveWatchOutput'],
      options
    )
  : undefined
const tests = spawn(process.execPath, args, options)

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    compiler?.kill(signal)
    tests.kill(signal)
  })
}
compiler?.once('error', error => {
  tests.kill()
  throw error
})
tests.once('error', error => {
  compiler?.kill()
  throw error
})
tests.once('exit', (code, signal) => {
  compiler?.kill()
  process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 1)
})

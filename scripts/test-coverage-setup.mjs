import { globSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const directory = fileURLToPath(new URL('../.test-build/', import.meta.url))
const require = createRequire(import.meta.url)

// Include untested modules too, matching the previous c8 --all behavior.
for (const file of globSync('**/*.js', {
  cwd: directory,
  exclude: [
    '**/*.test.js',
    '**/index.js',
    '**/spec.js',
    'core/types.js',
    'browser.js',
  ],
})) {
  require(resolve(directory, file))
}

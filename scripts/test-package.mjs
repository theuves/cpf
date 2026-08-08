import { execFileSync } from 'node:child_process'
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'cpf-package-'))

function run(command, args, cwd = temporaryDirectory) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

try {
  const packOutput = execFileSync(
    'npm',
    ['pack', '--json', '--pack-destination', temporaryDirectory],
    { cwd: projectRoot, encoding: 'utf8' }
  )
  const [{ filename }] = JSON.parse(packOutput)
  const tarball = join(temporaryDirectory, basename(filename))

  writeFileSync(
    join(temporaryDirectory, 'package.json'),
    JSON.stringify({ private: true, type: 'module' })
  )
  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    tarball,
  ])

  writeFileSync(
    join(temporaryDirectory, 'esm.mjs'),
    `
      import cpf, { cnpj, cpfParse } from 'cpf'
      import cpfSubpath from 'cpf/cpf'
      import cnpjSubpath from 'cpf/cnpj'

      if (!cpf.validate('529.982.247-25')) process.exit(1)
      if (!cnpj.validate('11.222.333/0001-81')) process.exit(1)
      if (!cpfParse('529.982.247-25')) process.exit(1)
      if (!cpfSubpath.validate('529.982.247-25')) process.exit(1)
      if (!cnpjSubpath.validate('11.222.333/0001-81')) process.exit(1)
    `
  )
  run(process.execPath, ['esm.mjs'])

  writeFileSync(
    join(temporaryDirectory, 'commonjs.cjs'),
    `
      const root = require('cpf')
      const cpf = require('cpf/cpf').default
      const cnpj = require('cpf/cnpj').default

      if (!root.default.validate('529.982.247-25')) process.exit(1)
      if (!cpf.validate('529.982.247-25')) process.exit(1)
      if (!cnpj.validate('11.222.333/0001-81')) process.exit(1)
    `
  )
  run(process.execPath, ['commonjs.cjs'])

  mkdirSync(join(temporaryDirectory, 'browser'))
  const browserBundle = readFileSync(
    join(temporaryDirectory, 'node_modules/cpf/dist/cpf.min.js'),
    'utf8'
  )
  writeFileSync(
    join(temporaryDirectory, 'browser/browser.cjs'),
    `${browserBundle}
      if (!globalThis.cpf.validate('529.982.247-25')) process.exit(1)
      if (!globalThis.cpf.cnpj.validate('11.222.333/0001-81')) process.exit(1)
    `
  )
  run(process.execPath, ['browser/browser.cjs'])

  writeFileSync(
    join(temporaryDirectory, 'consumer.ts'),
    `
      import cpf, { cnpj } from 'cpf'
      import cpfSubpath from 'cpf/cpf'
      import cnpjSubpath from 'cpf/cnpj'

      const one: string = cpf.generate({ count: 1 })
      const many: string[] = cpf.generate({ count: 2 })
      const dynamicCount: number = Date.now() % 2 === 0 ? 1 : 2
      const dynamic: string | string[] = cpf.generate({ count: dynamicCount })

      cpfSubpath.validate(one)
      cnpjSubpath.validate(cnpj.generate())
      void many
      void dynamic
    `
  )
  run(resolve(projectRoot, 'node_modules/.bin/tsc'), [
    '--noEmit',
    '--strict',
    '--target',
    'ES2020',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    'consumer.ts',
  ])

  writeFileSync(
    join(temporaryDirectory, 'consumer.cts'),
    `
      import root = require('cpf')
      import cpf = require('cpf/cpf')
      import cnpj = require('cpf/cnpj')

      const generated: string = root.default.generate()
      cpf.default.validate(generated)
      cnpj.default.validate(cnpj.default.generate())
    `
  )
  run(resolve(projectRoot, 'node_modules/.bin/tsc'), [
    '--noEmit',
    '--strict',
    '--target',
    'ES2020',
    '--module',
    'NodeNext',
    '--moduleResolution',
    'NodeNext',
    'consumer.cts',
  ])

  process.stdout.write(
    'Package tarball passed ESM, CommonJS, browser and TypeScript checks.\n'
  )
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}

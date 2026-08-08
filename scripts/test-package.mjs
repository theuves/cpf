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

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertCommandFails(command, args, expectedText) {
  try {
    execFileSync(command, args, {
      cwd: temporaryDirectory,
      encoding: 'utf8',
      stdio: 'pipe',
    })
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`
    assert(
      output.includes(expectedText),
      `Expected failure containing ${expectedText}`
    )
    return
  }
  throw new Error(
    `Command unexpectedly succeeded: ${command} ${args.join(' ')}`
  )
}

try {
  const packOutput = execFileSync(
    'npm',
    ['pack', '--json', '--pack-destination', temporaryDirectory],
    { cwd: projectRoot, encoding: 'utf8' }
  )
  const [pack] = JSON.parse(packOutput)
  const { filename, files } = pack
  const packedPaths = new Set(files.map(file => file.path))
  const requiredPaths = [
    'CHANGELOG.md',
    'LICENSE',
    'README.md',
    'package.json',
    'dist/cpf.cjs',
    'dist/cpf.mjs',
    'dist/cpf.min.js',
    'dist/index.d.ts',
    'dist/index.d.mts',
    'dist/index.d.cts',
    'dist/cpf/index.cjs',
    'dist/cpf/index.mjs',
    'dist/cnpj/index.cjs',
    'dist/cnpj/index.mjs',
  ]
  for (const path of requiredPaths) {
    assert(packedPaths.has(path), `Required package file is missing: ${path}`)
  }
  const forbiddenPrefixes = ['src/', 'scripts/', '.github/', 'coverage/']
  for (const { path } of files) {
    assert(
      !forbiddenPrefixes.some(prefix => path.startsWith(prefix)),
      `Internal file leaked into package: ${path}`
    )
  }
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
      import cpf, { cnpj } from 'cpf'
      import cpfSubpath from 'cpf/cpf'
      import cnpjSubpath from 'cpf/cnpj'

      if (!cpf.isValid('529.982.247-25')) process.exit(1)
      if (!cnpj.isValid('11.222.333/0001-81')) process.exit(1)
      if (!cnpj.isValid('12.ABC.345/01DE-35')) process.exit(1)
      if (!cpf.parse('529.982.247-25')) process.exit(1)
      if (!cpf.inspect('529.982.247-25').valid) process.exit(1)
      if (cnpj.getKind('12.ABC.345/01DE-35') !== 'alphanumeric') process.exit(1)
      if (!cpfSubpath.isValid('529.982.247-25')) process.exit(1)
      if (!cnpjSubpath.isValid('11.222.333/0001-81')) process.exit(1)
      if (!cnpjSubpath.isValid('12.ABC.345/01DE-35')) process.exit(1)
    `
  )
  run(process.execPath, ['esm.mjs'])

  writeFileSync(
    join(temporaryDirectory, 'commonjs.cjs'),
    `
      const root = require('cpf')
      const cpf = require('cpf/cpf').default
      const cnpj = require('cpf/cnpj').default

      if (!root.default.isValid('529.982.247-25')) process.exit(1)
      if (!cpf.isValid('529.982.247-25')) process.exit(1)
      if (!cnpj.isValid('11.222.333/0001-81')) process.exit(1)
      if (!cnpj.isValid('12.ABC.345/01DE-35')) process.exit(1)
      if (!cpf.inspect('529.982.247-25').valid) process.exit(1)
      if (cnpj.getKind('11.222.333/0001-81') !== 'numeric') process.exit(1)
    `
  )
  run(process.execPath, ['commonjs.cjs'])

  assertCommandFails(
    process.execPath,
    ['--input-type=module', '--eval', "await import('cpf/core/document')"],
    'ERR_PACKAGE_PATH_NOT_EXPORTED'
  )

  mkdirSync(join(temporaryDirectory, 'browser'))
  const browserBundle = readFileSync(
    join(temporaryDirectory, 'node_modules/cpf/dist/cpf.min.js'),
    'utf8'
  )
  writeFileSync(
    join(temporaryDirectory, 'browser/browser.cjs'),
    `${browserBundle}
      if (!globalThis.cpf.isValid('529.982.247-25')) process.exit(1)
      if (!globalThis.cpf.cnpj.isValid('11.222.333/0001-81')) process.exit(1)
      if (!globalThis.cpf.cnpj.isValid('12.ABC.345/01DE-35')) process.exit(1)
      if (!globalThis.cpf.inspect('529.982.247-25').valid) process.exit(1)
      if (globalThis.cpf.cnpj.getKind('12.ABC.345/01DE-35') !== 'alphanumeric') process.exit(1)
    `
  )
  run(process.execPath, ['browser/browser.cjs'])

  writeFileSync(
    join(temporaryDirectory, 'consumer.ts'),
    `
      import cpf, {
        cnpj,
        type CnpjCharacter,
        type CpfFormatOptions,
        type CpfIssueCode,
      } from 'cpf'
      import cpfSubpath from 'cpf/cpf'
      import cnpjSubpath from 'cpf/cnpj'
      import type { FormatOptions as CnpjFormatOptions } from 'cpf/cnpj'

      const one: string = cpf.generate()
      const many: string[] = cpf.generateMany(2)
      const alphanumeric: string = cnpj.generate({ kind: 'alphanumeric' })
      const body: string = cnpj.parse('12.ABC.345/01DE-35').root
      const inspected: boolean = cpf.inspect(one).valid
      const kind = cnpj.getKind(alphanumeric)
      const cpfIssue: CpfIssueCode = 'INVALID_CHECK_DIGITS'
      const cnpjCharacter: CnpjCharacter = 'A'
      const cpfFormatOptions: CpfFormatOptions = { strict: false }
      const cnpjFormatOptions: CnpjFormatOptions = { strict: true }

      cpfSubpath.isValid(one)
      cnpjSubpath.isValid(cnpj.generate())
      cnpjSubpath.isValid(alphanumeric)
      cnpj.calculateCheckDigits('12.ABC.345/01DE')
      void many
      void body
      void inspected
      void kind
      void cpfIssue
      void cnpjCharacter
      void cpfFormatOptions
      void cnpjFormatOptions
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
      cpf.default.isValid(generated)
      cnpj.default.isValid(cnpj.default.generate())
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

  const installedRoot = join(temporaryDirectory, 'node_modules/cpf')
  for (const mapPath of [
    'dist/cpf.cjs.map',
    'dist/cpf.mjs.map',
    'dist/cpf.min.js.map',
  ]) {
    const sourceMap = JSON.parse(
      readFileSync(join(installedRoot, mapPath), 'utf8')
    )
    assert(sourceMap.sources.length > 0, `Sourcemap has no sources: ${mapPath}`)
    assert(
      sourceMap.sourcesContent?.every(source => typeof source === 'string'),
      `Sourcemap has incomplete sourcesContent: ${mapPath}`
    )
  }

  process.stdout.write(
    'Package tarball passed contents, exports, sourcemaps, runtimes and TypeScript checks.\n'
  )
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}

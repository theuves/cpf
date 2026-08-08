import { createRequire } from 'node:module'
import process from 'node:process'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function assertApi(cpf, cnpj, runtime) {
  assert(cpf.isValid('529.982.247-25'), `${runtime}: CPF validation failed`)
  assert(
    cnpj.isValid('11.222.333/0001-81'),
    `${runtime}: numeric CNPJ validation failed`
  )
  assert(
    cnpj.isValid('12.ABC.345/01DE-35'),
    `${runtime}: alphanumeric CNPJ validation failed`
  )
  assert(
    cpf.inspect('529.982.247-25').valid,
    `${runtime}: CPF inspection failed`
  )
  assert(
    cnpj.getKind('12.ABC.345/01DE-35') === 'alphanumeric',
    `${runtime}: CNPJ classification failed`
  )
}

const esmRoot = await import('cpf')
const esmCpf = await import('cpf/cpf')
const esmCnpj = await import('cpf/cnpj')
assertApi(esmRoot.default, esmRoot.cnpj, 'ESM root')
assertApi(esmCpf.default, esmCnpj.default, 'ESM subpaths')

const require = createRequire(import.meta.url)
const cjsRoot = require('cpf')
const cjsCpf = require('cpf/cpf')
const cjsCnpj = require('cpf/cnpj')
assertApi(cjsRoot.default, cjsRoot.cnpj, 'CommonJS root')
assertApi(cjsCpf.default, cjsCnpj.default, 'CommonJS subpaths')

delete globalThis.cpf
require('../dist/cpf.min.js')
assert(globalThis.cpf, 'Browser bundle did not expose globalThis.cpf')
assertApi(globalThis.cpf, globalThis.cpf.cnpj, 'Browser IIFE')

process.stdout.write(
  `Runtime smoke tests passed on Node.js ${process.versions.node}.\n`
)

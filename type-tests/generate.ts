import generateCpf from '../src/cpf/generate'
import generateCnpj from '../src/cnpj/generate'

function expectType<Value>(value: Value): void {
  void value
}

const dynamicCount: number = Math.random() > 0.5 ? 1 : 2

const defaultCpf = generateCpf()
const oneCpf = generateCpf({ count: 1 })
const manyCpfs = generateCpf({ count: 2 })
const dynamicCpfs = generateCpf({ count: dynamicCount })

const defaultCnpj = generateCnpj()
const oneCnpj = generateCnpj({ count: 1 })
const manyCnpjs = generateCnpj({ count: 2 })
const dynamicCnpjs = generateCnpj({ count: dynamicCount })
const alphanumericCnpj = generateCnpj({ mode: 'alphanumeric' })

expectType<string>(defaultCpf)
expectType<string>(oneCpf)
expectType<string[]>(manyCpfs)
expectType<string | string[]>(dynamicCpfs)

expectType<string>(defaultCnpj)
expectType<string>(oneCnpj)
expectType<string[]>(manyCnpjs)
expectType<string | string[]>(dynamicCnpjs)
expectType<string>(alphanumericCnpj)

import test from 'ava'
import cpf from './cpf/index'
import cnpj from './cnpj/index'

const documents = [
  {
    name: 'CPF',
    api: cpf,
    body: [5, 2, 9, 9, 8, 2, 2, 4, 7],
    digits: '52998224725',
  },
  {
    name: 'CNPJ',
    api: cnpj,
    body: [1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0, 1],
    digits: '11222333000181',
  },
] as const

for (const document of documents) {
  test(`${document.name}: format and unformat are stable`, t => {
    const formatted = document.api.format(document.digits)
    t.is(document.api.unformat(formatted), document.digits)
    t.is(document.api.format(formatted), formatted)
  })

  test(`${document.name}: generated validity matches the requested mode`, t => {
    const valid = document.api.generate({ count: 100, formatted: false })
    const invalid = document.api.generate({
      count: 100,
      formatted: false,
      valid: false,
    })

    t.true(valid.every(value => document.api.validate(value)))
    t.true(invalid.every(value => !document.api.validate(value)))
  })

  test(`${document.name}: repair only returns valid documents`, t => {
    const broken = `${document.digits.slice(0, -1)}X`
    const repaired = document.api.repair(broken)

    t.true(repaired.length > 0)
    t.true(repaired.every(value => document.api.validate(value)))
  })

  test(`${document.name}: verifier calculation does not mutate its input`, t => {
    const body = [...document.body]
    const snapshot = [...body]
    document.api.calc(body)
    t.deepEqual(body, snapshot)
  })
}

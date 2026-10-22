import test from 'ava'
import cpf, { cnpj } from './index'

for (const [name, document, formatted] of [
  ['CPF', cpf, '529.982.247-25'],
  ['numeric CNPJ', cnpj, '11.222.333/0001-81'],
  ['alphanumeric CNPJ', cnpj, '12.ABC.345/01DE-35'],
] as const) {
  test(`${name}: accepts every prefix of the canonical mask`, t => {
    for (let length = 0; length <= formatted.length; length++) {
      const prefix = formatted.slice(0, length)
      t.true(document.matchesFormat(prefix, { completeness: 'partial' }))
      t.is(document.matchesFormat(prefix), length === formatted.length)
    }
  })

  test(`${name}: requires separators before starting the next group`, t => {
    for (let index = 0; index < formatted.length; index++) {
      if (!'.-/'.includes(formatted.charAt(index))) continue
      const missingSeparator =
        formatted.slice(0, index) + formatted.slice(index + 1)
      for (
        let length = index + 1;
        length <= missingSeparator.length;
        length++
      ) {
        t.false(
          document.matchesFormat(missingSeparator.slice(0, length), {
            completeness: 'partial',
          })
        )
      }
    }
  })
}

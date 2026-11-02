import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import cpf, { cnpj } from './index'

test('exposes only the canonical CPF operations', () => {
  assert.deepStrictEqual(Object.keys(cpf).sort(), [
    'calculateCheckDigits',
    'findValidRepairs',
    'format',
    'generate',
    'generateMany',
    'getFiscalRegions',
    'inspect',
    'isValid',
    'matchesFormat',
    'normalize',
    'parse',
  ])
  assert.strictEqual(cpf.isValid('529.982.247-25'), true)
  assert.strictEqual(cpf.inspect('529.982.247-25').valid, true)
  assert.strictEqual(
    cpf.matchesFormat('529.982', { completeness: 'partial' }),
    true
  )
  assert.strictEqual(cpf.normalize('529.982.247-25'), '52998224725')
  assert.deepStrictEqual(
    cpf.calculateCheckDigits([5, 2, 9, 9, 8, 2, 2, 4, 7]),
    [2, 5]
  )
  assert.deepStrictEqual(cpf.findValidRepairs('5299822472X'), ['52998224725'])
  assert.deepStrictEqual(cpf.getFiscalRegions('529.982.247-25'), ['ES', 'RJ'])
  assert.deepStrictEqual(cpf.parse('529.982.247-25'), {
    value: '52998224725',
    body: '529982247',
    checkDigits: '25',
    regionDigit: '7',
  })
})

test('keeps generation return types and validity deterministic', () => {
  const cpfValue = cpf.generate({ output: 'plain', randomSource: () => 0 })
  const cnpjValue = cnpj.generate({ output: 'plain', randomSource: () => 0 })
  assert.strictEqual(typeof cpfValue, 'string')
  assert.strictEqual(typeof cnpjValue, 'string')
  assert.strictEqual(cpf.isValid(cpfValue), true)
  assert.strictEqual(cnpj.isValid(cnpjValue), true)
  assert.strictEqual(
    cpf.generateMany(2, { output: 'plain' }).every(cpf.isValid),
    true
  )
  assert.strictEqual(
    cnpj
      .generateMany(2, { kind: 'alphanumeric', output: 'plain' })
      .every(cnpj.isValid),
    true
  )
  assert.strictEqual(cpf.isValid(cpf.generate({ validity: 'invalid' })), false)
  assert.strictEqual(
    cnpj.isValid(cnpj.generate({ validity: 'invalid' })),
    false
  )
})

test('exposes canonical CNPJ operations and complete semantic parsing', () => {
  assert.deepStrictEqual(Object.keys(cnpj).sort(), [
    'calculateCheckDigits',
    'findValidRepairs',
    'format',
    'generate',
    'generateMany',
    'getKind',
    'inspect',
    'isValid',
    'matchesFormat',
    'normalize',
    'parse',
  ])
  assert.strictEqual(
    cnpj.matchesFormat('12.ABC', { completeness: 'partial' }),
    true
  )
  assert.strictEqual(cnpj.getKind('12.ABC.345/01DE-35'), 'alphanumeric')
  assert.strictEqual(cnpj.inspect('12.ABC.345/01DE-35').valid, true)
  assert.strictEqual(cnpj.normalize('12.abc.345/01de-35'), '12ABC34501DE35')
  assert.deepStrictEqual(cnpj.calculateCheckDigits('12ABC34501DE'), [3, 5])
  assert.deepStrictEqual(cnpj.findValidRepairs('12.ABC.345/01DE-3?'), [
    '12ABC34501DE35',
  ])
  assert.deepStrictEqual(cnpj.parse('12.ABC.345/01DE-35'), {
    value: '12ABC34501DE35',
    root: '12ABC345',
    branch: '01DE',
    checkDigits: '35',
  })
  assert.deepStrictEqual(cnpj.parse('12.abc.345/01de-35'), {
    value: '12ABC34501DE35',
    root: '12ABC345',
    branch: '01DE',
    checkDigits: '35',
  })
  assert.deepStrictEqual(cpf.parse('5.2.9.9.8.2.2.4.7.2.5'), {
    value: '52998224725',
    body: '529982247',
    checkDigits: '25',
    regionDigit: '7',
  })
  assert.strictEqual(cpf.matchesFormat('5.2.9.9.8.2.2.4.7.2.5'), false)
  assert.strictEqual(
    cnpj.getKind('1.2.A.B.C.3.4.5.0.1.D.E.3.5'),
    'alphanumeric'
  )
  assert.strictEqual(cnpj.matchesFormat('1.2.A.B.C.3.4.5.0.1.D.E.3.5'), false)
  assert.throws(() => cnpj.parse('12.ABC'), {
    message: 'CNPJ must contain exactly 14 characters',
  })
  assert.throws(() => cpf.parse('529.982'), {
    message: 'CPF must contain exactly 11 digits',
  })
})

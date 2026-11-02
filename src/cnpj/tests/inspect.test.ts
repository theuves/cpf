import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import inspect from '../inspect'

test('should inspect valid numeric and alphanumeric CNPJs', () => {
  assert.deepStrictEqual(inspect('11.222.333/0001-81'), {
    valid: true,
    normalized: '11222333000181',
  })
  assert.deepStrictEqual(inspect('12.ABC.345/01DE-35'), {
    valid: true,
    normalized: '12ABC34501DE35',
  })
})

test('should diagnose invalid CNPJ inputs', () => {
  assert.deepStrictEqual(inspect(null), {
    valid: false,
    normalized: null,
    issue: 'INVALID_TYPE',
  })
  assert.deepStrictEqual(inspect('12.abc.345/01de-35'), {
    valid: false,
    normalized: null,
    issue: 'INVALID_CHARACTERS',
  })
  assert.deepStrictEqual(inspect(''), {
    valid: false,
    normalized: '',
    issue: 'INVALID_LENGTH',
  })
  assert.deepStrictEqual(inspect('12.ABC'), {
    valid: false,
    normalized: '12ABC',
    issue: 'INVALID_LENGTH',
  })
  assert.deepStrictEqual(inspect('12.ABC.345/01DE-3A'), {
    valid: false,
    normalized: '12ABC34501DE3A',
    issue: 'INVALID_VERIFIER_CHARACTERS',
  })
  assert.deepStrictEqual(inspect('00.000.000/0000-00'), {
    valid: false,
    normalized: '00000000000000',
    issue: 'REPEATED_CHARACTERS',
  })
  assert.deepStrictEqual(inspect('12.ABC.345/01DE-36'), {
    valid: false,
    normalized: '12ABC34501DE36',
    issue: 'INVALID_CHECK_DIGITS',
  })
})

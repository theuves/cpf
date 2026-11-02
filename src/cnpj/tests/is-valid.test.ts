import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import validate from '../is-valid'

test('should accept valid formatted and unformatted CNPJs', () => {
  assert.strictEqual(validate('11.222.333/0001-81'), true)
  assert.strictEqual(validate('11222333000181'), true)
  assert.strictEqual(validate('11.222333/0001-81'), true)
})

test('should accept official numeric and alphanumeric reference vectors', () => {
  for (const cnpj of [
    '12.ABC.345/01DE-35',
    '1345C3A5000106',
    'ABCDEFGHIJKL80',
    '00000000000191',
  ]) {
    assert.strictEqual(validate(cnpj), true)
  }
})

test('should reject incorrect check digits', () => {
  assert.strictEqual(validate('11.222.333/0001-80'), false)
  assert.strictEqual(validate('11.222.333/0001-91'), false)
})

test('should reject repeated digits', () => {
  assert.strictEqual(validate('00.000.000/0000-00'), false)
  assert.strictEqual(validate('11.111.111/1111-11'), false)
})

test('should reject invalid lengths and characters', () => {
  assert.strictEqual(validate('11.222.333/0001-8'), false)
  assert.strictEqual(validate('11.222.333/0001-810'), false)
  assert.strictEqual(validate('11.222.abc/0001-81'), false)
  assert.strictEqual(validate(''), false)
  assert.strictEqual(validate('12.ABc.345/01DE-35'), false)
  assert.strictEqual(validate('12.ABC.345/01DE-3A'), false)
})

test('should reject incorrect alphanumeric verifiers', () => {
  assert.strictEqual(validate('12.ABC.345/01DE-34'), false)
  assert.strictEqual(validate('ABCDEFGHIJKL81'), false)
  assert.strictEqual(validate('R55231B3000700'), false)
})

test('should reject non-string input', () => {
  for (const value of [11222333000181, null, undefined, {}, []]) {
    // @ts-expect-error Runtime input validation is intentional.
    assert.strictEqual(validate(value), false)
  }
})

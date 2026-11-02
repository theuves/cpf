import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import validate from '../is-valid'

test('should return true for valid CPF with dots and dash', () => {
  const cpf = '529.982.247-25'
  assert.strictEqual(validate(cpf), true)
})

test('should return true for valid CPF without formatting', () => {
  const cpf = '52998224725'
  assert.strictEqual(validate(cpf), true)
})

test('should return true for valid CPF with mixed formatting', () => {
  const cpf = '529.982247-25'
  assert.strictEqual(validate(cpf), true)
})

test('should return false for CPF with all same digits', () => {
  const cpf = '111.111.111-11'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for CPF with all same digits without formatting', () => {
  const cpf = '11111111111'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for CPF with invalid first verifier', () => {
  const cpf = '529.982.247-35'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for CPF with invalid second verifier', () => {
  const cpf = '529.982.247-26'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for CPF with both invalid verifiers', () => {
  const cpf = '529.982.247-36'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for CPF with less than 11 digits', () => {
  const cpf = '529.982.247-2'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for CPF with more than 11 digits', () => {
  const cpf = '529.982.247-250'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for empty string', () => {
  const cpf = ''
  assert.strictEqual(validate(cpf), false)
})

test('should return false for string with no digits', () => {
  const cpf = 'abc.def.ghi-jk'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for string with mixed digits and letters', () => {
  const cpf = '529a982b247c25'
  assert.strictEqual(validate(cpf), false)
})

test('should return false for non-string input', () => {
  // @ts-expect-error invalid type
  assert.strictEqual(validate(52998224725), false)
  // @ts-expect-error invalid type
  assert.strictEqual(validate(null), false)
  // @ts-expect-error invalid type
  assert.strictEqual(validate(undefined), false)
  // @ts-expect-error invalid type
  assert.strictEqual(validate({}), false)
  // @ts-expect-error invalid type
  assert.strictEqual(validate([]), false)
})

test('should return true for another valid CPF', () => {
  const cpf = '123.456.789-09'
  assert.strictEqual(validate(cpf), true)
})

test('should return true for valid CPF with zeros', () => {
  const cpf = '000.000.001-91'
  assert.strictEqual(validate(cpf), true)
})

test('should return false for CPF with only zeros', () => {
  const cpf = '000.000.000-00'
  assert.strictEqual(validate(cpf), false)
})

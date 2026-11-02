import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import rfs from '../get-fiscal-regions'

test('should return correct RF for valid CPF with 9th digit 0', () => {
  const cpf = '123.456.780-00'
  assert.deepStrictEqual(rfs(cpf), ['RS'])
})

test('should return correct RF for valid CPF with 9th digit 1', () => {
  const cpf = '123.456.781-01'
  assert.deepStrictEqual(rfs(cpf), ['DF', 'GO', 'MS', 'MT', 'TO'])
})

test('should return correct RF for valid CPF with 9th digit 2', () => {
  const cpf = '123.456.782-02'
  assert.deepStrictEqual(rfs(cpf), ['AC', 'AM', 'AP', 'PA', 'RO', 'RR'])
})

test('should return correct RF for valid CPF with 9th digit 3', () => {
  const cpf = '123.456.783-03'
  assert.deepStrictEqual(rfs(cpf), ['CE', 'MA', 'PI'])
})

test('should return correct RF for valid CPF with 9th digit 4', () => {
  const cpf = '123.456.784-04'
  assert.deepStrictEqual(rfs(cpf), ['AL', 'PB', 'PE', 'RN'])
})

test('should return correct RF for valid CPF with 9th digit 5', () => {
  const cpf = '123.456.785-05'
  assert.deepStrictEqual(rfs(cpf), ['BA', 'SE'])
})

test('should return correct RF for valid CPF with 9th digit 6', () => {
  const cpf = '123.456.786-06'
  assert.deepStrictEqual(rfs(cpf), ['MG'])
})

test('should return correct RF for valid CPF with 9th digit 7', () => {
  const cpf = '123.456.787-07'
  assert.deepStrictEqual(rfs(cpf), ['ES', 'RJ'])
})

test('should return correct RF for valid CPF with 9th digit 8', () => {
  const cpf = '123.456.788-08'
  assert.deepStrictEqual(rfs(cpf), ['SP'])
})

test('should return correct RF for valid CPF with 9th digit 9', () => {
  const cpf = '123.456.789-09'
  assert.deepStrictEqual(rfs(cpf), ['PR', 'SC'])
})

test('should return empty array for CPF with less than 11 digits', () => {
  const cpf = '123.456.789-0'
  assert.deepStrictEqual(rfs(cpf), [])
})

test('should return empty array for non-string input', () => {
  // @ts-expect-error invalid type
  assert.deepStrictEqual(rfs(12345678900), [])
  // @ts-expect-error invalid type
  assert.deepStrictEqual(rfs(null), [])
  // @ts-expect-error invalid type
  assert.deepStrictEqual(rfs(undefined), [])
  // @ts-expect-error invalid type
  assert.deepStrictEqual(rfs({}), [])
  // @ts-expect-error invalid type
  assert.deepStrictEqual(rfs([]), [])
})

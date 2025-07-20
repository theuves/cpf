import test from 'ava'
import rfs from '../rfs'

test('should return correct RF for valid CPF with 9th digit 0', t => {
  const cpf = '123.456.780-00'
  t.deepEqual(rfs(cpf), ['RS'])
})

test('should return correct RF for valid CPF with 9th digit 1', t => {
  const cpf = '123.456.781-01'
  t.deepEqual(rfs(cpf), ['DF', 'GO', 'MS', 'MT', 'TO'])
})

test('should return correct RF for valid CPF with 9th digit 2', t => {
  const cpf = '123.456.782-02'
  t.deepEqual(rfs(cpf), ['AC', 'AM', 'AP', 'PA', 'RO', 'RR'])
})

test('should return correct RF for valid CPF with 9th digit 3', t => {
  const cpf = '123.456.783-03'
  t.deepEqual(rfs(cpf), ['CE', 'MA', 'PI'])
})

test('should return correct RF for valid CPF with 9th digit 4', t => {
  const cpf = '123.456.784-04'
  t.deepEqual(rfs(cpf), ['AL', 'PB', 'PE', 'RN'])
})

test('should return correct RF for valid CPF with 9th digit 5', t => {
  const cpf = '123.456.785-05'
  t.deepEqual(rfs(cpf), ['BA', 'SE'])
})

test('should return correct RF for valid CPF with 9th digit 6', t => {
  const cpf = '123.456.786-06'
  t.deepEqual(rfs(cpf), ['MG'])
})

test('should return correct RF for valid CPF with 9th digit 7', t => {
  const cpf = '123.456.787-07'
  t.deepEqual(rfs(cpf), ['ES', 'RJ'])
})

test('should return correct RF for valid CPF with 9th digit 8', t => {
  const cpf = '123.456.788-08'
  t.deepEqual(rfs(cpf), ['SP'])
})

test('should return correct RF for valid CPF with 9th digit 9', t => {
  const cpf = '123.456.789-09'
  t.deepEqual(rfs(cpf), ['PR', 'SC'])
})

test('should return empty array for CPF with less than 11 digits', t => {
  const cpf = '123.456.789-0'
  t.deepEqual(rfs(cpf), [])
})

test('should return empty array for non-string input', t => {
  // @ts-expect-error invalid type
  t.deepEqual(rfs(12345678900), [])
  // @ts-expect-error invalid type
  t.deepEqual(rfs(null), [])
  // @ts-expect-error invalid type
  t.deepEqual(rfs(undefined), [])
  // @ts-expect-error invalid type
  t.deepEqual(rfs({}), [])
  // @ts-expect-error invalid type
  t.deepEqual(rfs([]), [])
})

import test from 'ava'
import validate from '../validate'

test('should return true for valid CPF with dots and dash', t => {
  const cpf = '529.982.247-25'
  t.true(validate(cpf))
})

test('should return true for valid CPF without formatting', t => {
  const cpf = '52998224725'
  t.true(validate(cpf))
})

test('should return true for valid CPF with mixed formatting', t => {
  const cpf = '529.982247-25'
  t.true(validate(cpf))
})

test('should return false for CPF with all same digits', t => {
  const cpf = '111.111.111-11'
  t.false(validate(cpf))
})

test('should return false for CPF with all same digits without formatting', t => {
  const cpf = '11111111111'
  t.false(validate(cpf))
})

test('should return false for CPF with invalid first verifier', t => {
  const cpf = '529.982.247-35'
  t.false(validate(cpf))
})

test('should return false for CPF with invalid second verifier', t => {
  const cpf = '529.982.247-26'
  t.false(validate(cpf))
})

test('should return false for CPF with both invalid verifiers', t => {
  const cpf = '529.982.247-36'
  t.false(validate(cpf))
})

test('should return false for CPF with less than 11 digits', t => {
  const cpf = '529.982.247-2'
  t.false(validate(cpf))
})

test('should return false for CPF with more than 11 digits', t => {
  const cpf = '529.982.247-250'
  t.false(validate(cpf))
})

test('should return false for empty string', t => {
  const cpf = ''
  t.false(validate(cpf))
})

test('should return false for string with no digits', t => {
  const cpf = 'abc.def.ghi-jk'
  t.false(validate(cpf))
})

test('should return false for string with mixed digits and letters', t => {
  const cpf = '529a982b247c25'
  t.false(validate(cpf))
})

test('should return false for non-string input', t => {
  // @ts-expect-error invalid type
  t.false(validate(52998224725))
  // @ts-expect-error invalid type
  t.false(validate(null))
  // @ts-expect-error invalid type
  t.false(validate(undefined))
  // @ts-expect-error invalid type
  t.false(validate({}))
  // @ts-expect-error invalid type
  t.false(validate([]))
})

test('should return true for another valid CPF', t => {
  const cpf = '123.456.789-09'
  t.true(validate(cpf))
})

test('should return true for valid CPF with zeros', t => {
  const cpf = '000.000.001-91'
  t.true(validate(cpf))
})

test('should return false for CPF with only zeros', t => {
  const cpf = '000.000.000-00'
  t.false(validate(cpf))
})

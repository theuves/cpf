import test from 'ava'
import check from '../check'

test('should return true for valid CNPJ in strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.true(check(cnpj))
})

test('should return false for invalid CNPJ in strict mode', t => {
  const cnpj = '12.345.678/0001-9'
  t.false(check(cnpj))
})

test('should return true for partially valid CNPJ in non-strict mode', t => {
  const cnpj1 = '12.34'
  const cnpj2 = '12.345.67'
  const cnpj3 = '12.345.678/000'
  const cnpj4 = '12.345.678/0001-9'
  t.true(check(cnpj1, { strict: false }))
  t.true(check(cnpj2, { strict: false }))
  t.true(check(cnpj3, { strict: false }))
  t.true(check(cnpj4, { strict: false }))
})

test('should return true for CNPJ ending with separators in non-strict mode', t => {
  const cnpj1 = '12.'
  const cnpj2 = '12.345.'
  const cnpj3 = '12.345.678/'
  const cnpj4 = '12.345.678/0001-'
  t.true(check(cnpj1, { strict: false }))
  t.true(check(cnpj2, { strict: false }))
  t.true(check(cnpj3, { strict: false }))
  t.true(check(cnpj4, { strict: false }))
})

test('should return false for invalid CNPJ in non-strict mode', t => {
  const cnpj1 = '123456.789/0001-95'
  const cnpj2 = '12.345.678/0001-950'
  const cnpj3 = '12.345.678/0001-9500'
  t.false(check(cnpj1, { strict: false }))
  t.false(check(cnpj2, { strict: false }))
  t.false(check(cnpj3, { strict: false }))
})

test('should return true for CNPJ with leading/trailing spaces in non-strict mode', t => {
  const cnpj = '  12.345.678/0001-95  '
  t.true(check(cnpj, { strict: false }))
})

test('should return false for CNPJ with invalid characters in non-strict mode', t => {
  const cnpj1 = '12abc345def678ghi0001jkl95'
  const cnpj2 = '12.345.678/0001-9a'
  const cnpj3 = '12.345.678/0001-9#'
  t.false(check(cnpj1, { strict: false }))
  t.false(check(cnpj2, { strict: false }))
  t.false(check(cnpj3, { strict: false }))
})

test('should return true for CNPJ with only valid characters in non-strict mode', t => {
  const cnpj1 = '12.345.678/0001-95'
  const cnpj2 = '12.345.678/0001-9'
  const cnpj3 = '12.345.678/0001'
  const cnpj4 = '12.345.678/000'
  const cnpj5 = '12.345.678/'
  const cnpj6 = '12.345.678'
  const cnpj7 = '12.345.67'
  const cnpj8 = '12.345.'
  const cnpj9 = '12.34'
  const cnpj10 = '12.'
  t.true(check(cnpj1, { strict: false }))
  t.true(check(cnpj2, { strict: false }))
  t.true(check(cnpj3, { strict: false }))
  t.true(check(cnpj4, { strict: false }))
  t.true(check(cnpj5, { strict: false }))
  t.true(check(cnpj6, { strict: false }))
  t.true(check(cnpj7, { strict: false }))
  t.true(check(cnpj8, { strict: false }))
  t.true(check(cnpj9, { strict: false }))
  t.true(check(cnpj10, { strict: false }))
})

test('should return false if the input is not a string', t => {
  const cnpj1 = 12345678000195
  const cnpj2 = null
  const cnpj3 = undefined
  const cnpj4 = {}
  const cnpj5 = []
  // @ts-expect-error invalid type
  t.false(check(cnpj1, { strict: false }))
  // @ts-expect-error invalid type
  t.false(check(cnpj2, { strict: false }))
  // @ts-expect-error invalid type
  t.false(check(cnpj3, { strict: false }))
  // @ts-expect-error invalid type
  t.false(check(cnpj4, { strict: false }))
  // @ts-expect-error invalid type
  t.false(check(cnpj5, { strict: false }))
})

test('should handle empty string in non-strict mode', t => {
  const cnpj = ''
  t.false(check(cnpj, { strict: false }))
})

test('should handle string with only spaces in non-strict mode', t => {
  const cnpj = '   '
  t.false(check(cnpj, { strict: false }))
})

test('should handle CNPJ with mixed separators in non-strict mode', t => {
  const cnpj1 = '12.345-678/0001.95'
  const cnpj2 = '12-345.678/0001-95'
  t.false(check(cnpj1, { strict: false }))
  t.false(check(cnpj2, { strict: false }))
})

test('should handle CNPJ with extra digits in non-strict mode', t => {
  const cnpj1 = '123.456.789/0001-95'
  const cnpj2 = '12.3456.789/0001-95'
  const cnpj3 = '12.345.6789/0001-95'
  t.false(check(cnpj1, { strict: false }))
  t.false(check(cnpj2, { strict: false }))
  t.false(check(cnpj3, { strict: false }))
})

test('should handle CNPJ with missing separators in non-strict mode', t => {
  const cnpj1 = '123456789000195'
  const cnpj2 = '12.3456789000195'
  const cnpj3 = '12.345.6789000195'
  t.false(check(cnpj1, { strict: false }))
  t.false(check(cnpj2, { strict: false }))
  t.false(check(cnpj3, { strict: false }))
}) 
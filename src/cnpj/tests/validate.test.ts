import test from 'ava'
import validate from '../validate'

test('should accept valid formatted and unformatted CNPJs', t => {
  t.true(validate('11.222.333/0001-81'))
  t.true(validate('11222333000181'))
  t.true(validate('11.222333/0001-81'))
})

test('should accept official numeric and alphanumeric reference vectors', t => {
  for (const cnpj of [
    '12.ABC.345/01DE-35',
    '1345C3A5000106',
    'ABCDEFGHIJKL80',
    '00000000000191',
  ]) {
    t.true(validate(cnpj))
  }
})

test('should reject incorrect check digits', t => {
  t.false(validate('11.222.333/0001-80'))
  t.false(validate('11.222.333/0001-91'))
})

test('should reject repeated digits', t => {
  t.false(validate('00.000.000/0000-00'))
  t.false(validate('11.111.111/1111-11'))
})

test('should reject invalid lengths and characters', t => {
  t.false(validate('11.222.333/0001-8'))
  t.false(validate('11.222.333/0001-810'))
  t.false(validate('11.222.abc/0001-81'))
  t.false(validate(''))
  t.false(validate('12.ABc.345/01DE-35'))
  t.false(validate('12.ABC.345/01DE-3A'))
})

test('should reject incorrect alphanumeric verifiers', t => {
  t.false(validate('12.ABC.345/01DE-34'))
  t.false(validate('ABCDEFGHIJKL81'))
  t.false(validate('R55231B3000700'))
})

test('should reject non-string input', t => {
  for (const value of [11222333000181, null, undefined, {}, []]) {
    // @ts-expect-error Runtime input validation is intentional.
    t.false(validate(value))
  }
})

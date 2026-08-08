import test from 'ava'
import validate from '../validate'

test('should accept valid formatted and unformatted CNPJs', t => {
  t.true(validate('11.222.333/0001-81'))
  t.true(validate('11222333000181'))
  t.true(validate('11.222333/0001-81'))
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
})

test('should reject non-string input', t => {
  for (const value of [11222333000181, null, undefined, {}, []]) {
    // @ts-expect-error Runtime input validation is intentional.
    t.false(validate(value))
  }
})

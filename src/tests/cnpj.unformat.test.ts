import test from 'ava'
import unformat from '../cnpj.unformat'

// Strict mode tests
test('should unformat complete CNPJ correctly in strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.is(unformat(cnpj), '12345678000195')
})

test('should unformat CNPJ with separators in strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.is(unformat(cnpj), '12345678000195')
})

test('should throw error for invalid characters in strict mode', t => {
  t.throws(() => unformat('12abc345def678ghi0001jkl95'), {
    message: 'Invalid characters in CNPJ input',
  })
  t.throws(() => unformat('12.345.678/0001-9a'), {
    message: 'Invalid characters in CNPJ input',
  })
  t.throws(() => unformat('12.345.678/0001-9#'), {
    message: 'Invalid characters in CNPJ input',
  })
})

test('should throw error for more than 14 digits in strict mode', t => {
  t.throws(() => unformat('123456789012345'), {
    message: 'CNPJ cannot have more than 14 digits',
  })
  t.throws(() => unformat('12.345.678/0001-950'), {
    message: 'CNPJ cannot have more than 14 digits',
  })
})

test('should throw error for non-string input in strict mode', t => {
  // @ts-expect-error invalid type
  t.throws(() => unformat(12345678000195), { message: 'Input must be a string' })
  // @ts-expect-error invalid type
  t.throws(() => unformat(null), { message: 'Input must be a string' })
  // @ts-expect-error invalid type
  t.throws(() => unformat(undefined), { message: 'Input must be a string' })
  // @ts-expect-error invalid type
  t.throws(() => unformat({}), { message: 'Input must be a string' })
  // @ts-expect-error invalid type
  t.throws(() => unformat([]), { message: 'Input must be a string' })
})

// Non-strict mode tests
test('should unformat complete CNPJ correctly in non-strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.is(unformat(cnpj, { strict: false }), '12345678000195')
})

test('should unformat CNPJ with separators in non-strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.is(unformat(cnpj, { strict: false }), '12345678000195')
})

test('should unformat CNPJ with extra characters in non-strict mode', t => {
  t.is(unformat('12abc345def678ghi0001jkl95', { strict: false }), '12345678000195')
  t.is(unformat('12.345.678/0001-9a', { strict: false }), '1234567800019')
  t.is(unformat('12.345.678/0001-9#', { strict: false }), '1234567800019')
})

test('should truncate CNPJ with more than 14 digits in non-strict mode', t => {
  t.is(unformat('123456789012345', { strict: false }), '12345678901234')
  t.is(unformat('12.345.678/0001-950', { strict: false }), '12345678000195')
}) 
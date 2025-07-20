import test from 'ava'
import unformat from '../unformat'

// Strict mode tests
test('should unformat complete CPF correctly in strict mode', t => {
  const cpf = '123.456.789-00'
  t.is(unformat(cpf), '12345678900')
})

test('should unformat CPF with separators in strict mode', t => {
  const cpf = '123.456.789-00'
  t.is(unformat(cpf), '12345678900')
})

test('should throw error for invalid characters in strict mode', t => {
  t.throws(() => unformat('123abc456def789ghi00'), {
    message: 'Invalid characters in CPF input',
  })
  t.throws(() => unformat('123.456.789-0a'), {
    message: 'Invalid characters in CPF input',
  })
  t.throws(() => unformat('123.456.789-0#'), {
    message: 'Invalid characters in CPF input',
  })
})

test('should throw error for more than 11 digits in strict mode', t => {
  t.throws(() => unformat('123456789012'), {
    message: 'CPF cannot have more than 11 digits',
  })
  t.throws(() => unformat('123.456.789-001'), {
    message: 'CPF cannot have more than 11 digits',
  })
})

test('should throw error for non-string input in strict mode', t => {
  // @ts-ignore
  t.throws(() => unformat(12345678900), { message: 'Input must be a string' })
  // @ts-ignore
  t.throws(() => unformat(null), { message: 'Input must be a string' })
  // @ts-ignore
  t.throws(() => unformat(undefined), { message: 'Input must be a string' })
  // @ts-ignore
  t.throws(() => unformat({}), { message: 'Input must be a string' })
  // @ts-ignore
  t.throws(() => unformat([]), { message: 'Input must be a string' })
})

// Non-strict mode tests
test('should unformat complete CPF correctly in non-strict mode', t => {
  const cpf = '123.456.789-00'
  t.is(unformat(cpf, false), '12345678900')
})

test('should unformat CPF with separators in non-strict mode', t => {
  const cpf = '123.456.789-00'
  t.is(unformat(cpf, false), '12345678900')
})

test('should unformat CPF with extra characters in non-strict mode', t => {
  t.is(unformat('123abc456def789ghi00', false), '12345678900')
  t.is(unformat('123.456.789-0a', false), '1234567890')
  t.is(unformat('123.456.789-0#', false), '1234567890')
})

test('should truncate CPF with more than 11 digits in non-strict mode', t => {
  t.is(unformat('123456789012', false), '12345678901')
  t.is(unformat('123.456.789-001', false), '12345678900')
})

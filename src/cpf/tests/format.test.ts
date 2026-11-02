import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import format from '../format'

// Strict mode tests
test('should allow clearing a CPF field in strict mode', () => {
  assert.strictEqual(format('1'), '1')
  assert.strictEqual(format(''), '')
  assert.strictEqual(format('', { strict: true }), '')
})

test('should format complete CPF correctly in strict mode', () => {
  const cpf = '12345678900'
  assert.strictEqual(format(cpf), '123.456.789-00')
})

test('should format CPF with separators in strict mode', () => {
  const cpf = '123.456.789-00'
  assert.strictEqual(format(cpf), '123.456.789-00')
})

test('should format partial CPF in strict mode', () => {
  assert.strictEqual(format('123'), '123')
  assert.strictEqual(format('1234'), '123.4')
  assert.strictEqual(format('12345'), '123.45')
  assert.strictEqual(format('123456'), '123.456')
  assert.strictEqual(format('1234567'), '123.456.7')
  assert.strictEqual(format('12345678'), '123.456.78')
  assert.strictEqual(format('123456789'), '123.456.789')
  assert.strictEqual(format('1234567890'), '123.456.789-0')
  assert.strictEqual(format('12345678901'), '123.456.789-01')
})

test('should throw error for invalid characters in strict mode', () => {
  assert.throws(() => format('123abc456def789ghi00'), {
    message: 'Invalid characters in CPF input',
  })
  assert.throws(() => format('123.456.789-0a'), {
    message: 'Invalid characters in CPF input',
  })
  assert.throws(() => format('123.456.789-0#'), {
    message: 'Invalid characters in CPF input',
  })
})

test('should throw error for more than 11 digits in strict mode', () => {
  assert.throws(() => format('123456789012'), {
    message: 'CPF cannot have more than 11 digits',
  })
  assert.throws(() => format('123.456.789-001'), {
    message: 'CPF cannot have more than 11 digits',
  })
})

test('should throw error for number input in strict mode', () => {
  assert.throws(() => format(12345678900), {
    message: 'Number input is only allowed when strict=false',
  })
})

test('should throw error for non-string/non-number input in strict mode', () => {
  // @ts-expect-error invalid type
  assert.throws(() => format(null), {
    message: 'Input must be a string or number',
  })
  // @ts-expect-error invalid type
  assert.throws(() => format(undefined), {
    message: 'Input must be a string or number',
  })
  // @ts-expect-error invalid type
  assert.throws(() => format({}), {
    message: 'Input must be a string or number',
  })
  // @ts-expect-error invalid type
  assert.throws(() => format([]), {
    message: 'Input must be a string or number',
  })
})

// Non-strict mode tests
test('should format complete CPF correctly in non-strict mode', () => {
  const cpf = '12345678900'
  assert.strictEqual(format(cpf, { strict: false }), '123.456.789-00')
})

test('should format CPF with separators in non-strict mode', () => {
  const cpf = '123.456.789-00'
  assert.strictEqual(format(cpf, { strict: false }), '123.456.789-00')
})

test('should format partial CPF in non-strict mode', () => {
  assert.strictEqual(format('123', { strict: false }), '123')
  assert.strictEqual(format('1234', { strict: false }), '123.4')
  assert.strictEqual(format('12345', { strict: false }), '123.45')
  assert.strictEqual(format('123456', { strict: false }), '123.456')
  assert.strictEqual(format('1234567', { strict: false }), '123.456.7')
  assert.strictEqual(format('12345678', { strict: false }), '123.456.78')
  assert.strictEqual(format('123456789', { strict: false }), '123.456.789')
  assert.strictEqual(format('1234567890', { strict: false }), '123.456.789-0')
  assert.strictEqual(format('12345678901', { strict: false }), '123.456.789-01')
})

test('should handle number input in non-strict mode', () => {
  assert.strictEqual(format(12345678900, { strict: false }), '123.456.789-00')
  assert.strictEqual(format(1234567890, { strict: false }), '012.345.678-90')
  assert.strictEqual(format(123456789, { strict: false }), '001.234.567-89')
  assert.strictEqual(format(12345678, { strict: false }), '000.123.456-78')
  assert.strictEqual(format(1234567, { strict: false }), '000.012.345-67')
  assert.strictEqual(format(123456, { strict: false }), '000.001.234-56')
  assert.strictEqual(format(12345, { strict: false }), '000.000.123-45')
  assert.strictEqual(format(1234, { strict: false }), '000.000.012-34')
  assert.strictEqual(format(123, { strict: false }), '000.000.001-23')
  assert.strictEqual(format(12, { strict: false }), '000.000.000-12')
  assert.strictEqual(format(1, { strict: false }), '000.000.000-01')
  assert.strictEqual(format(0, { strict: false }), '000.000.000-00')
})

test('should truncate more than 11 digits in non-strict mode', () => {
  assert.strictEqual(
    format('123456789012', { strict: false }),
    '123.456.789-01'
  )
  assert.strictEqual(
    format('123456789012345', { strict: false }),
    '123.456.789-01'
  )
})

test('should handle CPF with spaces in non-strict mode', () => {
  assert.strictEqual(
    format('  123.456.789-00  ', { strict: false }),
    '123.456.789-00'
  )
  assert.strictEqual(
    format(' 123 456 789 00 ', { strict: false }),
    '123.456.789-00'
  )
})

test('should handle CPF with mixed separators in non-strict mode', () => {
  assert.strictEqual(
    format('123-456.789-00', { strict: false }),
    '123.456.789-00'
  )
  assert.strictEqual(
    format('123.456-789.00', { strict: false }),
    '123.456.789-00'
  )
})

test('should handle CPF with only digits in non-strict mode', () => {
  assert.strictEqual(format('12345678900', { strict: false }), '123.456.789-00')
  assert.strictEqual(format('1234567890', { strict: false }), '123.456.789-0')
  assert.strictEqual(format('123456789', { strict: false }), '123.456.789')
})

test('should handle CPF ending with separators in non-strict mode', () => {
  assert.strictEqual(format('123.', { strict: false }), '123')
  assert.strictEqual(format('123.456.', { strict: false }), '123.456')
  assert.strictEqual(format('123.456.789-', { strict: false }), '123.456.789')
})

test('should handle empty string in non-strict mode', () => {
  assert.strictEqual(format('', { strict: false }), '')
})

test('should handle string with only non-digits in non-strict mode', () => {
  assert.strictEqual(format('abc', { strict: false }), '')
  assert.strictEqual(format('...', { strict: false }), '')
  assert.strictEqual(format('---', { strict: false }), '')
  assert.strictEqual(format('   ', { strict: false }), '')
})

// Edge cases
test('should handle single digit in both modes', () => {
  assert.strictEqual(format('1'), '1')
  assert.strictEqual(format('1', { strict: false }), '1')
})

test('should handle two digits in both modes', () => {
  assert.strictEqual(format('12'), '12')
  assert.strictEqual(format('12', { strict: false }), '12')
})

test('should handle three digits in both modes', () => {
  assert.strictEqual(format('123'), '123')
  assert.strictEqual(format('123', { strict: false }), '123')
})

test('should handle exactly 11 digits in both modes', () => {
  assert.strictEqual(format('12345678901'), '123.456.789-01')
  assert.strictEqual(format('12345678901', { strict: false }), '123.456.789-01')
})

test('should handle number with leading zeros in non-strict mode', () => {
  assert.strictEqual(format(1234567890, { strict: false }), '012.345.678-90')
  assert.strictEqual(format(123456789, { strict: false }), '001.234.567-89')
  assert.strictEqual(format(12345678, { strict: false }), '000.123.456-78')
})

test('should handle very large numbers in non-strict mode', () => {
  assert.strictEqual(
    format(123456789012345, { strict: false }),
    '123.456.789-01'
  )
  assert.strictEqual(
    format(999999999999999, { strict: false }),
    '999.999.999-99'
  )
})

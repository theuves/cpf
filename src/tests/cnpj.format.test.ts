import test from 'ava'
import format from '../cnpj.format'

// Strict mode tests
test('should format complete CNPJ correctly in strict mode', t => {
  const cnpj = '12345678000195'
  t.is(format(cnpj), '12.345.678/0001-95')
})

test('should format CNPJ with separators in strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.is(format(cnpj), '12.345.678/0001-95')
})

test('should format partial CNPJ in strict mode', t => {
  t.is(format('12'), '12')
  t.is(format('123'), '12.3')
  t.is(format('1234'), '12.34')
  t.is(format('12345'), '12.345')
  t.is(format('123456'), '12.345.6')
  t.is(format('1234567'), '12.345.67')
  t.is(format('12345678'), '12.345.678')
  t.is(format('123456789'), '12.345.678/9')
  t.is(format('1234567890'), '12.345.678/90')
  t.is(format('12345678901'), '12.345.678/901')
  t.is(format('123456789012'), '12.345.678/9012')
  t.is(format('1234567890123'), '12.345.678/9012-3')
  t.is(format('12345678901234'), '12.345.678/9012-34')
})

test('should throw error for invalid characters in strict mode', t => {
  t.throws(() => format('12abc345def678ghi0001jkl95'), {
    message: 'Invalid characters in CNPJ input',
  })
  t.throws(() => format('12.345.678/0001-9a'), {
    message: 'Invalid characters in CNPJ input',
  })
  t.throws(() => format('12.345.678/0001-9#'), {
    message: 'Invalid characters in CNPJ input',
  })
})

test('should throw error for more than 14 digits in strict mode', t => {
  t.throws(() => format('123456789012345'), {
    message: 'CNPJ cannot have more than 14 digits',
  })
  t.throws(() => format('12.345.678/0001-950'), {
    message: 'CNPJ cannot have more than 14 digits',
  })
})

test('should throw error for number input in strict mode', t => {
  t.throws(() => format(12345678000195), {
    message: 'Number input is only allowed when strict=false',
  })
})

test('should throw error for non-string/non-number input in strict mode', t => {
  // @ts-expect-error invalid type
  t.throws(() => format(null), { message: 'Input must be a string or number' })
  // @ts-expect-error invalid type
  t.throws(() => format(undefined), {
    message: 'Input must be a string or number',
  })
  // @ts-expect-error invalid type
  t.throws(() => format({}), { message: 'Input must be a string or number' })
  // @ts-expect-error invalid type
  t.throws(() => format([]), { message: 'Input must be a string or number' })
})

// Non-strict mode tests
test('should format complete CNPJ correctly in non-strict mode', t => {
  const cnpj = '12345678000195'
  t.is(format(cnpj, false), '12.345.678/0001-95')
})

test('should format CNPJ with separators in non-strict mode', t => {
  const cnpj = '12.345.678/0001-95'
  t.is(format(cnpj, false), '12.345.678/0001-95')
})

test('should format partial CNPJ in non-strict mode', t => {
  t.is(format('12', false), '12')
  t.is(format('123', false), '12.3')
  t.is(format('1234', false), '12.34')
  t.is(format('12345', false), '12.345')
  t.is(format('123456', false), '12.345.6')
  t.is(format('1234567', false), '12.345.67')
  t.is(format('12345678', false), '12.345.678')
  t.is(format('123456789', false), '12.345.678/9')
  t.is(format('1234567890', false), '12.345.678/90')
  t.is(format('12345678901', false), '12.345.678/901')
  t.is(format('123456789012', false), '12.345.678/9012')
  t.is(format('1234567890123', false), '12.345.678/9012-3')
  t.is(format('12345678901234', false), '12.345.678/9012-34')
})

test('should handle number input in non-strict mode', t => {
  t.is(format(12345678000195, false), '12.345.678/0001-95')
  t.is(format(1234567800019, false), '01.234.567/8000-19')
  t.is(format(123456780001, false), '00.123.456/7800-01')
  t.is(format(12345678000, false), '00.012.345/6780-00')
  t.is(format(1234567800, false), '00.001.234/5678-00')
  t.is(format(123456780, false), '00.000.123/4567-80')
  t.is(format(12345678, false), '00.000.012/3456-78')
  t.is(format(1234567, false), '00.000.001/2345-67')
  t.is(format(123456, false), '00.000.000/1234-56')
  t.is(format(12345, false), '00.000.000/0123-45')
  t.is(format(1234, false), '00.000.000/0012-34')
  t.is(format(123, false), '00.000.000/0001-23')
  t.is(format(12, false), '00.000.000/0000-12')
  t.is(format(1, false), '00.000.000/0000-01')
  t.is(format(0, false), '00.000.000/0000-00')
})

test('should truncate more than 14 digits in non-strict mode', t => {
  t.is(format('123456789012345', false), '12.345.678/9012-34')
  t.is(format('123456789012345678', false), '12.345.678/9012-34')
})

test('should handle CNPJ with spaces in non-strict mode', t => {
  t.is(format('  12.345.678/0001-95  ', false), '12.345.678/0001-95')
  t.is(format(' 12 345 678 0001 95 ', false), '12.345.678/0001-95')
})

test('should handle CNPJ with mixed separators in non-strict mode', t => {
  t.is(format('12-345.678/0001-95', false), '12.345.678/0001-95')
  t.is(format('12.345-678/0001.95', false), '12.345.678/0001-95')
})

test('should handle CNPJ with only digits in non-strict mode', t => {
  t.is(format('12345678000195', false), '12.345.678/0001-95')
  t.is(format('1234567800019', false), '12.345.678/0001-9')
  t.is(format('123456780001', false), '12.345.678/0001')
})

test('should handle CNPJ ending with separators in non-strict mode', t => {
  t.is(format('12.', false), '12')
  t.is(format('12.345.', false), '12.345')
  t.is(format('12.345.678/', false), '12.345.678')
  t.is(format('12.345.678/0001-', false), '12.345.678/0001')
})

test('should handle empty string in non-strict mode', t => {
  t.is(format('', false), '')
})

test('should handle string with only non-digits in non-strict mode', t => {
  t.is(format('abc', false), '')
  t.is(format('...', false), '')
  t.is(format('---', false), '')
  t.is(format('///', false), '')
  t.is(format('   ', false), '')
})

// Edge cases
test('should handle single digit in both modes', t => {
  t.is(format('1'), '1')
  t.is(format('1', false), '1')
})

test('should handle two digits in both modes', t => {
  t.is(format('12'), '12')
  t.is(format('12', false), '12')
})

test('should handle three digits in both modes', t => {
  t.is(format('123'), '12.3')
  t.is(format('123', false), '12.3')
})

test('should handle exactly 14 digits in both modes', t => {
  t.is(format('12345678901234'), '12.345.678/9012-34')
  t.is(format('12345678901234', false), '12.345.678/9012-34')
})

test('should handle number with leading zeros in non-strict mode', t => {
  t.is(format(1234567800019, false), '01.234.567/8000-19')
  t.is(format(123456780001, false), '00.123.456/7800-01')
  t.is(format(12345678000, false), '00.012.345/6780-00')
})

test('should handle very large numbers in non-strict mode', t => {
  t.is(format(123456789012345, false), '12.345.678/9012-34')
  t.is(format(999999999999999, false), '99.999.999/9999-99')
})

test('should handle CNPJ with different separator patterns', t => {
  t.is(format('12.345.678/0001-95', false), '12.345.678/0001-95')
  t.is(format('12.345.678/0001', false), '12.345.678/0001')
  t.is(format('12.345.678/', false), '12.345.678')
  t.is(format('12.345.', false), '12.345')
  t.is(format('12.', false), '12')
})

test('should handle CNPJ with extra characters in non-strict mode', t => {
  t.is(format('12abc345def678ghi0001jkl95', false), '12.345.678/0001-95')
  t.is(format('12.345.678/0001-9a', false), '12.345.678/0001-9')
  t.is(format('12.345.678/0001-9#', false), '12.345.678/0001-9')
})

test('should handle CNPJ with all zeros', t => {
  t.is(format('00000000000000', false), '00.000.000/0000-00')
  t.is(format(0, false), '00.000.000/0000-00')
})

test('should handle CNPJ with all nines', t => {
  t.is(format('99999999999999', false), '99.999.999/9999-99')
  t.is(format(99999999999999, false), '99.999.999/9999-99')
}) 
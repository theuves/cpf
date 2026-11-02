import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import format from '../format'
import matchesFormat from '../matches-format'
import normalize from '../normalize'

// Strict mode tests
test('should format complete CNPJ correctly in strict mode', () => {
  const cnpj = '12345678000195'
  assert.strictEqual(format(cnpj), '12.345.678/0001-95')
})

test('should format CNPJ with separators in strict mode', () => {
  const cnpj = '12.345.678/0001-95'
  assert.strictEqual(format(cnpj), '12.345.678/0001-95')
})

test('should format alphanumeric CNPJ in strict mode', () => {
  assert.strictEqual(format('12ABC34501DE35'), '12.ABC.345/01DE-35')
  assert.strictEqual(format('12.ABC.345/01DE-35'), '12.ABC.345/01DE-35')
})

test('should format partial CNPJ in strict mode', () => {
  assert.strictEqual(format('12'), '12')
  assert.strictEqual(format('123'), '12.3')
  assert.strictEqual(format('1234'), '12.34')
  assert.strictEqual(format('12345'), '12.345')
  assert.strictEqual(format('123456'), '12.345.6')
  assert.strictEqual(format('1234567'), '12.345.67')
  assert.strictEqual(format('12345678'), '12.345.678')
  assert.strictEqual(format('123456789'), '12.345.678/9')
  assert.strictEqual(format('1234567890'), '12.345.678/90')
  assert.strictEqual(format('12345678901'), '12.345.678/901')
  assert.strictEqual(format('123456789012'), '12.345.678/9012')
  assert.strictEqual(format('1234567890123'), '12.345.678/9012-3')
  assert.strictEqual(format('12345678901234'), '12.345.678/9012-34')
})

test('should throw error for invalid characters in strict mode', () => {
  assert.throws(() => format('12abc345def678ghi0001jkl95'), {
    message: 'Invalid characters in CNPJ input',
  })
  assert.throws(() => format('12.345.678/0001-9a'), {
    message: 'Invalid characters in CNPJ input',
  })
  assert.throws(() => format('12.345.678/0001-9#'), {
    message: 'Invalid characters in CNPJ input',
  })
})

test('should throw error for more than 14 digits in strict mode', () => {
  assert.throws(() => format('123456789012345'), {
    message: 'CNPJ cannot have more than 14 characters',
  })
  assert.throws(() => format('12.345.678/0001-950'), {
    message: 'CNPJ cannot have more than 14 characters',
  })
})

test('should reject letters in verifier positions in strict mode', () => {
  assert.throws(() => format('12ABC34501DE3A'), {
    message: 'CNPJ verifier positions must contain digits',
  })
})

test('should throw error for number input in strict mode', () => {
  assert.throws(() => format(12345678000195), {
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
test('should format complete CNPJ correctly in non-strict mode', () => {
  const cnpj = '12345678000195'
  assert.strictEqual(format(cnpj, { strict: false }), '12.345.678/0001-95')
})

test('should normalize lowercase alphanumeric CNPJ in non-strict mode', () => {
  assert.strictEqual(
    format('12.abc.345/01de-35', { strict: false }),
    '12.ABC.345/01DE-35'
  )
})

test('should remove letters from verifier positions before truncating in non-strict mode', () => {
  for (const [suffix, expected] of [
    ['3A', '12.ABC.345/01DE-3'],
    ['ZZ', '12.ABC.345/01DE'],
    ['A35', '12.ABC.345/01DE-35'],
    ['a3b5c6', '12.ABC.345/01DE-35'],
  ] as const) {
    const formatted = format(`12ABC34501DE${suffix}`, { strict: false })
    assert.strictEqual(formatted, expected)
    assert.strictEqual(
      matchesFormat(formatted, { completeness: 'partial' }),
      true
    )
    assert.strictEqual(format(normalize(formatted)), formatted)
  }
})

test('should discard Unicode without converting it into ASCII in non-strict mode', () => {
  const value = '12abc34501de35'
  for (const character of ['ß', 'ı', 'ſ', 'ﬀ']) {
    for (const position of [0, 2, 11, 12, 13, 14]) {
      const input = value.slice(0, position) + character + value.slice(position)
      assert.strictEqual(format(input, { strict: false }), '12.ABC.345/01DE-35')
    }
  }
})

test('should format CNPJ with separators in non-strict mode', () => {
  const cnpj = '12.345.678/0001-95'
  assert.strictEqual(format(cnpj, { strict: false }), '12.345.678/0001-95')
})

test('should format partial CNPJ in non-strict mode', () => {
  assert.strictEqual(format('12', { strict: false }), '12')
  assert.strictEqual(format('123', { strict: false }), '12.3')
  assert.strictEqual(format('1234', { strict: false }), '12.34')
  assert.strictEqual(format('12345', { strict: false }), '12.345')
  assert.strictEqual(format('123456', { strict: false }), '12.345.6')
  assert.strictEqual(format('1234567', { strict: false }), '12.345.67')
  assert.strictEqual(format('12345678', { strict: false }), '12.345.678')
  assert.strictEqual(format('123456789', { strict: false }), '12.345.678/9')
  assert.strictEqual(format('1234567890', { strict: false }), '12.345.678/90')
  assert.strictEqual(format('12345678901', { strict: false }), '12.345.678/901')
  assert.strictEqual(
    format('123456789012', { strict: false }),
    '12.345.678/9012'
  )
  assert.strictEqual(
    format('1234567890123', { strict: false }),
    '12.345.678/9012-3'
  )
  assert.strictEqual(
    format('12345678901234', { strict: false }),
    '12.345.678/9012-34'
  )
})

test('should handle number input in non-strict mode', () => {
  assert.strictEqual(
    format(12345678000195, { strict: false }),
    '12.345.678/0001-95'
  )
  assert.strictEqual(
    format(1234567800019, { strict: false }),
    '01.234.567/8000-19'
  )
  assert.strictEqual(
    format(123456780001, { strict: false }),
    '00.123.456/7800-01'
  )
  assert.strictEqual(
    format(12345678000, { strict: false }),
    '00.012.345/6780-00'
  )
  assert.strictEqual(
    format(1234567800, { strict: false }),
    '00.001.234/5678-00'
  )
  assert.strictEqual(format(123456780, { strict: false }), '00.000.123/4567-80')
  assert.strictEqual(format(12345678, { strict: false }), '00.000.012/3456-78')
  assert.strictEqual(format(1234567, { strict: false }), '00.000.001/2345-67')
  assert.strictEqual(format(123456, { strict: false }), '00.000.000/1234-56')
  assert.strictEqual(format(12345, { strict: false }), '00.000.000/0123-45')
  assert.strictEqual(format(1234, { strict: false }), '00.000.000/0012-34')
  assert.strictEqual(format(123, { strict: false }), '00.000.000/0001-23')
  assert.strictEqual(format(12, { strict: false }), '00.000.000/0000-12')
  assert.strictEqual(format(1, { strict: false }), '00.000.000/0000-01')
  assert.strictEqual(format(0, { strict: false }), '00.000.000/0000-00')
})

test('should truncate more than 14 digits in non-strict mode', () => {
  assert.strictEqual(
    format('123456789012345', { strict: false }),
    '12.345.678/9012-34'
  )
  assert.strictEqual(
    format('123456789012345678', { strict: false }),
    '12.345.678/9012-34'
  )
})

test('should handle CNPJ with spaces in non-strict mode', () => {
  assert.strictEqual(
    format('  12.345.678/0001-95  ', { strict: false }),
    '12.345.678/0001-95'
  )
  assert.strictEqual(
    format(' 12 345 678 0001 95 ', { strict: false }),
    '12.345.678/0001-95'
  )
})

test('should handle CNPJ with mixed separators in non-strict mode', () => {
  assert.strictEqual(
    format('12-345.678/0001-95', { strict: false }),
    '12.345.678/0001-95'
  )
  assert.strictEqual(
    format('12.345-678/0001.95', { strict: false }),
    '12.345.678/0001-95'
  )
})

test('should handle CNPJ with only digits in non-strict mode', () => {
  assert.strictEqual(
    format('12345678000195', { strict: false }),
    '12.345.678/0001-95'
  )
  assert.strictEqual(
    format('1234567800019', { strict: false }),
    '12.345.678/0001-9'
  )
  assert.strictEqual(
    format('123456780001', { strict: false }),
    '12.345.678/0001'
  )
})

test('should handle CNPJ ending with separators in non-strict mode', () => {
  assert.strictEqual(format('12.', { strict: false }), '12')
  assert.strictEqual(format('12.345.', { strict: false }), '12.345')
  assert.strictEqual(format('12.345.678/', { strict: false }), '12.345.678')
  assert.strictEqual(
    format('12.345.678/0001-', { strict: false }),
    '12.345.678/0001'
  )
})

test('should handle empty string in non-strict mode', () => {
  assert.strictEqual(format('', { strict: false }), '')
})

test('should handle string with only non-digits in non-strict mode', () => {
  assert.strictEqual(format('abc', { strict: false }), 'AB.C')
  assert.strictEqual(format('...', { strict: false }), '')
  assert.strictEqual(format('---', { strict: false }), '')
  assert.strictEqual(format('///', { strict: false }), '')
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
  assert.strictEqual(format('123'), '12.3')
  assert.strictEqual(format('123', { strict: false }), '12.3')
})

test('should handle exactly 14 digits in both modes', () => {
  assert.strictEqual(format('12345678901234'), '12.345.678/9012-34')
  assert.strictEqual(
    format('12345678901234', { strict: false }),
    '12.345.678/9012-34'
  )
})

test('should handle number with leading zeros in non-strict mode', () => {
  assert.strictEqual(
    format(1234567800019, { strict: false }),
    '01.234.567/8000-19'
  )
  assert.strictEqual(
    format(123456780001, { strict: false }),
    '00.123.456/7800-01'
  )
  assert.strictEqual(
    format(12345678000, { strict: false }),
    '00.012.345/6780-00'
  )
})

test('should handle very large numbers in non-strict mode', () => {
  assert.strictEqual(
    format(123456789012345, { strict: false }),
    '12.345.678/9012-34'
  )
  assert.strictEqual(
    format(999999999999999, { strict: false }),
    '99.999.999/9999-99'
  )
})

test('should handle CNPJ with different separator patterns', () => {
  assert.strictEqual(
    format('12.345.678/0001-95', { strict: false }),
    '12.345.678/0001-95'
  )
  assert.strictEqual(
    format('12.345.678/0001', { strict: false }),
    '12.345.678/0001'
  )
  assert.strictEqual(format('12.345.678/', { strict: false }), '12.345.678')
  assert.strictEqual(format('12.345.', { strict: false }), '12.345')
  assert.strictEqual(format('12.', { strict: false }), '12')
})

test('should handle CNPJ with extra characters in non-strict mode', () => {
  assert.strictEqual(
    format('12abc345def678ghi0001jkl95', { strict: false }),
    '12.ABC.345/DEF6-78'
  )
  assert.strictEqual(
    format('12.345.678/0001-9a', { strict: false }),
    '12.345.678/0001-9'
  )
  assert.strictEqual(
    format('12.345.678/0001-9#', { strict: false }),
    '12.345.678/0001-9'
  )
})

test('should handle CNPJ with all zeros', () => {
  assert.strictEqual(
    format('00000000000000', { strict: false }),
    '00.000.000/0000-00'
  )
  assert.strictEqual(format(0, { strict: false }), '00.000.000/0000-00')
})

test('should handle CNPJ with all nines', () => {
  assert.strictEqual(
    format('99999999999999', { strict: false }),
    '99.999.999/9999-99'
  )
  assert.strictEqual(
    format(99999999999999, { strict: false }),
    '99.999.999/9999-99'
  )
})

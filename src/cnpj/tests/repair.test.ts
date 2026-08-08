import test from 'ava'
import repair from '../repair'

test('should return empty array for non-string input', t => {
  t.deepEqual(repair(null as any), [])
  t.deepEqual(repair(undefined as any), [])
  t.deepEqual(repair(123 as any), [])
  t.deepEqual(repair({} as any), [])
})

test('should return empty array for invalid length', t => {
  t.deepEqual(repair('1234567890123'), []) // 13 digits
  t.deepEqual(repair('123456789012345'), []) // 15 digits
  t.deepEqual(repair('123456789012'), []) // 12 digits
})

test('should return empty array for more than 2 placeholders', t => {
  t.deepEqual(repair('12345678901???'), [])
  t.deepEqual(repair('1234567890????'), [])
})

test('should return empty array for 2 placeholders outside verifier positions', t => {
  t.deepEqual(repair('?12345678901?1'), [])
  t.deepEqual(repair('12345678901??1'), [])
})

test('should return valid CNPJ when no X present', t => {
  const validCnpj = '11222333000181'
  t.deepEqual(repair(validCnpj), [validCnpj])
})

test('should return empty array for invalid CNPJ when no X present', t => {
  const invalidCnpj = '11222333000182'
  t.deepEqual(repair(invalidCnpj), [])
})

test('should repair single X in first verifier position', t => {
  const cnpjWithX = '1122233300018X'
  const expected = '11222333000181'
  const result = repair(cnpjWithX)
  t.deepEqual(result, [expected])
})

test('should repair single X in second verifier position', t => {
  const cnpjWithX = '112223330001X1'
  const expected = '11222333000181'
  const result = repair(cnpjWithX)
  t.deepEqual(result, [expected])
})

test('should repair single X in base digits', t => {
  const cnpjWithUnknown = '?1222333000181'
  const result = repair(cnpjWithUnknown)
  t.true(result.length > 0)
  t.true(result.every(cnpj => cnpj.length === 14))
  t.true(result.every(cnpj => !cnpj.includes('X')))
})

test('should repair two X in verifier positions', t => {
  const cnpjWithXX = '112223330001??'
  const expected = '11222333000181'
  const result = repair(cnpjWithXX)
  t.deepEqual(result, [expected])
})

test('should handle CNPJ with formatting', t => {
  const cnpjWithX = '11.222.333/0001-8X'
  const expected = '11222333000181'
  const result = repair(cnpjWithX)
  t.deepEqual(result, [expected])
})

test('should return multiple valid CNPJs when X is in base digits', t => {
  const cnpjWithUnknown = '1?222333000181'
  const result = repair(cnpjWithUnknown)
  t.true(result.length > 0)
  t.true(result.every(cnpj => cnpj.length === 14))
  t.true(result.every(cnpj => !cnpj.includes('X')))
})

test('should handle edge case with all same digits', t => {
  const cnpjWithUnknown = '111111111111?1'
  const result = repair(cnpjWithUnknown)
  // Should return empty array because all same digits is invalid
  t.deepEqual(result, [])
})

test('should repair alphanumeric body and verifiers with an unambiguous placeholder', t => {
  t.true(repair('12?BC34501DE35').includes('12ABC34501DE35'))
  t.deepEqual(repair('12ABC34501DE??'), ['12ABC34501DE35'])
  t.deepEqual(repair('12.ABC.345/01DE-3?'), ['12ABC34501DE35'])
})

test('should treat X as data in the body', t => {
  t.deepEqual(repair('ABCDEFGHIJKL80'), ['ABCDEFGHIJKL80'])
  t.deepEqual(repair('XBCDEFGHIJKL80'), [])
})

test('should allow explicit numeric or alphanumeric replacement alphabets', t => {
  t.true(
    repair('?2ABC34501DE35', { mode: 'alphanumeric' }).includes(
      '12ABC34501DE35'
    )
  )
  t.deepEqual(repair('?2ABC34501DE35', { mode: 'numeric' }), ['12ABC34501DE35'])
})

test('should support a custom non-conflicting placeholder', t => {
  t.deepEqual(repair('12ABC34501DE3_', { placeholder: '_' }), [
    '12ABC34501DE35',
  ])
})

test('should reject ambiguous placeholders', t => {
  for (const placeholder of ['X', '.', '/', '-', ' ', '??']) {
    t.throws(() => repair('12ABC34501DE35', { placeholder }), {
      message:
        'Placeholder must be one non-alphanumeric, non-separator character',
    })
  }
})

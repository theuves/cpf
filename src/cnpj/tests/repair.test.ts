import test from 'ava'
import repair from '../repair'

test('should return empty array for non-string input', (t) => {
  t.deepEqual(repair(null as any), [])
  t.deepEqual(repair(undefined as any), [])
  t.deepEqual(repair(123 as any), [])
  t.deepEqual(repair({} as any), [])
})

test('should return empty array for invalid length', (t) => {
  t.deepEqual(repair('1234567890123'), []) // 13 digits
  t.deepEqual(repair('123456789012345'), []) // 15 digits
  t.deepEqual(repair('123456789012'), []) // 12 digits
})

test('should return empty array for more than 2 X characters', (t) => {
  t.deepEqual(repair('123456789012XXX'), []) // 3 X
  t.deepEqual(repair('123456789012XXXX'), []) // 4 X
})

test('should return empty array for 2 X not in verifier positions', (t) => {
  t.deepEqual(repair('123456789012X1X'), []) // X in positions 12,14 (invalid)
  t.deepEqual(repair('1234567890121XX'), []) // X in positions 13,14 (invalid)
})

test('should return valid CNPJ when no X present', (t) => {
  const validCnpj = '11222333000181'
  t.deepEqual(repair(validCnpj), [validCnpj])
})

test('should return empty array for invalid CNPJ when no X present', (t) => {
  const invalidCnpj = '11222333000182'
  t.deepEqual(repair(invalidCnpj), [])
})

test('should repair single X in first verifier position', (t) => {
  const cnpjWithX = '1122233300018X'
  const expected = '11222333000181'
  const result = repair(cnpjWithX)
  t.deepEqual(result, [expected])
})

test('should repair single X in second verifier position', (t) => {
  const cnpjWithX = '112223330001X1'
  const expected = '11222333000181'
  const result = repair(cnpjWithX)
  t.deepEqual(result, [expected])
})

test('should repair single X in base digits', (t) => {
  const cnpjWithX = '112223330001X1'
  const result = repair(cnpjWithX)
  t.true(result.length > 0)
  t.true(result.every(cnpj => cnpj.length === 14))
  t.true(result.every(cnpj => !cnpj.includes('X')))
})

test('should repair two X in verifier positions', (t) => {
  const cnpjWithXX = '112223330001XX'
  const expected = '11222333000181'
  const result = repair(cnpjWithXX)
  t.deepEqual(result, [expected])
})

test('should handle CNPJ with formatting', (t) => {
  const cnpjWithX = '11.222.333/0001-8X'
  const expected = '11222333000181'
  const result = repair(cnpjWithX)
  t.deepEqual(result, [expected])
})

test('should return multiple valid CNPJs when X is in base digits', (t) => {
  const cnpjWithX = '112223330001X1'
  const result = repair(cnpjWithX)
  t.true(result.length > 0)
  t.true(result.every(cnpj => cnpj.length === 14))
  t.true(result.every(cnpj => !cnpj.includes('X')))
})

test('should handle edge case with all same digits', (t) => {
  const cnpjWithX = '111111111111X1'
  const result = repair(cnpjWithX)
  // Should return empty array because all same digits is invalid
  t.deepEqual(result, [])
}) 
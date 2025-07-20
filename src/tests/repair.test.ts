import test from 'ava'
import repair from '../repair'

test('should return array with valid CPF when X is at the beginning', t => {
  const result = repair('X7552060107')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with valid CPF when X is in the middle', t => {
  const result = repair('075X2060107')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with valid CPF when X is at the end of base digits', t => {
  const result = repair('0755206X107')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with valid CPF when X is in the second verifier', t => {
  const result = repair('0755206010X')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with valid CPF when there are 0 X', t => {
  const result = repair('07552060107')
  t.deepEqual(result, ['07552060107'])
})

test('should return empty array for invalid CPF when there are 0 X', t => {
  const result = repair('11111111111')
  t.deepEqual(result, [])
})

test('should return empty array for CPF with two X outside verifiers', t => {
  const result = repair('0X55X060107')
  t.deepEqual(result, [])
})

test('should return empty array for CPF with three X', t => {
  const result = repair('0755XXX0107')
  t.deepEqual(result, [])
})

test('should return empty array for CPF with many X', t => {
  const result = repair('XXXX2060107')
  t.deepEqual(result, [])
})

test('should return array with all valid CPFs possible for 2 X in verifiers', t => {
  const result = repair('075520601XX')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with all valid CPFs possible for X in first verifier', t => {
  const result = repair('075520601X7')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with all valid CPFs possible for X in second verifier', t => {
  const result = repair('0755206010X')
  t.deepEqual(result, ['07552060107'])
})

test('should return array with valid CPF for 2 X in verifiers (case 123456789XX)', t => {
  const result = repair('123456789XX')
  t.deepEqual(result, ['12345678909'])
})

test('should return empty array for CPF with less than 11 digits', t => {
  const result = repair('0755206010')
  t.deepEqual(result, [])
})

test('should return empty array for CPF with more than 11 digits', t => {
  const result = repair('075520601078')
  t.deepEqual(result, [])
})

test('should return empty array for empty string', t => {
  const result = repair('')
  t.deepEqual(result, [])
})

test('should return array with valid CPF for string with special characters', t => {
  const result = repair('075.520.601-07')
  t.deepEqual(result, ['07552060107'])
})

test('should return empty array for null', t => {
  // @ts-ignore
  const result = repair(null)
  t.deepEqual(result, [])
})

test('should return empty array for undefined', t => {
  // @ts-ignore
  const result = repair(undefined)
  t.deepEqual(result, [])
})

test('should return empty array for number', t => {
  // @ts-ignore
  const result = repair(12345678901)
  t.deepEqual(result, [])
})

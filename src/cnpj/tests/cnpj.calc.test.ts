import test from 'ava'
import calc from '../cnpj.calc'

test('should return correct verifiers for valid body', t => {
  const body = [1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0, 1]
  const result = calc(body)
  t.deepEqual(result, [8, 1])
})

test('should return correct verifiers for another valid body', t => {
  const body = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  const result = calc(body)
  t.deepEqual(result, [9, 1])
})

test('should throw error for body with less than 12 digits', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'Input must be exactly 12 digits')
})

test('should throw error for body with more than 12 digits', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'Input must be exactly 12 digits')
})

test('should throw error for body with non-integer values', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 'a']
  const error = t.throws(
    () => {
      // @ts-expect-error invalid type
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'All elements must be integers between 0 and 9')
})

test('should throw error for body with integers out of range', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 10]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'All elements must be integers between 0 and 9')
})

test('should throw error for body with negative integers', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, -1]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'All elements must be integers between 0 and 9')
})

test('should handle all zeros correctly', t => {
  const body = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const result = calc(body)
  t.deepEqual(result, [0, 0])
})

test('should handle all nines correctly', t => {
  const body = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  const result = calc(body)
  t.deepEqual(result, [6, 2])
})

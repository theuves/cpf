import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import calc from '../calculate-check-digits'

test('should return correct verifiers for valid body', () => {
  const body = [1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0, 1]
  const result = calc(body)
  assert.deepStrictEqual(result, [8, 1])
})

test('should return correct verifiers for another valid body', () => {
  const body = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
  const result = calc(body)
  assert.deepStrictEqual(result, [9, 1])
})

test('should calculate the official alphanumeric example', () => {
  assert.deepStrictEqual(calc('12.ABC.345/01DE'), [3, 5])
  assert.deepStrictEqual(
    calc([1, 2, 'A', 'B', 'C', 3, 4, 5, 0, 1, 'D', 'E']),
    [3, 5]
  )
})

test('should throw error for body with less than 12 digits', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(error.message, 'Input must be exactly 12 characters')
      return true
    }
  )
})

test('should throw error for body with more than 12 digits', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(error.message, 'Input must be exactly 12 characters')
      return true
    }
  )
  assert.throws(() => calc('1234567890123'), {
    message: 'Input must be exactly 12 characters',
  })
  assert.throws(() => calc('1'.repeat(1_000_000)), {
    message: 'Input must be exactly 12 characters',
  })
})

test('should throw error for body with non-integer values', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 'a']
  assert.throws(
    () => {
      // @ts-expect-error runtime rejection protects JavaScript consumers
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(
        error.message,
        'All elements must be digits or uppercase letters from A to Z'
      )
      return true
    }
  )
})

test('should throw error for body with integers out of range', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 10]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(
        error.message,
        'All elements must be digits or uppercase letters from A to Z'
      )
      return true
    }
  )
})

test('should throw error for body with negative integers', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, -1]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(
        error.message,
        'All elements must be digits or uppercase letters from A to Z'
      )
      return true
    }
  )
})

test('should handle all zeros correctly', () => {
  const body = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const result = calc(body)
  assert.deepStrictEqual(result, [0, 0])
})

test('should handle all nines correctly', () => {
  const body = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]
  const result = calc(body)
  assert.deepStrictEqual(result, [6, 2])
})

test('should reject lowercase and non-ASCII body characters', () => {
  assert.throws(() => calc('12ABc34501DE'), {
    message: 'All elements must be digits or uppercase letters from A to Z',
  })
  assert.throws(() => calc('12ABC34501DÉ'), {
    message: 'All elements must be digits or uppercase letters from A to Z',
  })
})

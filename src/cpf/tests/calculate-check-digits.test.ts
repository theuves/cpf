import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import calc from '../calculate-check-digits'

test('should return correct verifiers for valid body', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const result = calc(body)
  assert.deepStrictEqual(result, [0, 9])
})

test('should throw error for body with less than 9 digits', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(error.message, 'Input must be exactly 9 digits')
      return true
    }
  )
})

test('should throw error for body with more than 9 digits', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(error.message, 'Input must be exactly 9 digits')
      return true
    }
  )
})

test('should throw error for body with non-integer values', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 'a']
  assert.throws(
    () => {
      // @ts-expect-error invalid type
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(
        error.message,
        'All elements must be integers between 0 and 9'
      )
      return true
    }
  )
})

test('should throw error for body with integers out of range', () => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 10]
  assert.throws(
    () => {
      calc(body)
    },
    (error: unknown) => {
      assert.ok(error instanceof Error)
      assert.strictEqual(
        error.message,
        'All elements must be integers between 0 and 9'
      )
      return true
    }
  )
})

test('should reject sparse bodies before calculating verifiers', () => {
  assert.throws(() => calc(new Array<number>(9)), {
    message: 'All elements must be integers between 0 and 9',
  })

  for (let position = 0; position < 9; position++) {
    const body = [5, 2, 9, 9, 8, 2, 2, 4, 7]
    delete body[position]

    assert.throws(() => calc(body), {
      message: 'All elements must be integers between 0 and 9',
    })
    assert.strictEqual(position in body, false)
  }
})

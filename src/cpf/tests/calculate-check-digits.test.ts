import test from 'ava'
import calc from '../calculate-check-digits'

test('should return correct verifiers for valid body', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const result = calc(body)
  t.deepEqual(result, [0, 9])
})

test('should throw error for body with less than 9 digits', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'Input must be exactly 9 digits')
})

test('should throw error for body with more than 9 digits', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'Input must be exactly 9 digits')
})

test('should throw error for body with non-integer values', t => {
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 'a']
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
  const body = [1, 2, 3, 4, 5, 6, 7, 8, 10]
  const error = t.throws(
    () => {
      calc(body)
    },
    { instanceOf: Error }
  )
  t.is(error.message, 'All elements must be integers between 0 and 9')
})

test('should reject sparse bodies before calculating verifiers', t => {
  t.throws(() => calc(new Array<number>(9)), {
    message: 'All elements must be integers between 0 and 9',
  })

  for (let position = 0; position < 9; position++) {
    const body = [5, 2, 9, 9, 8, 2, 2, 4, 7]
    delete body[position]

    t.throws(() => calc(body), {
      message: 'All elements must be integers between 0 and 9',
    })
    t.false(position in body)
  }
})

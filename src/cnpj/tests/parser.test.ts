import test from 'ava'
import parser from '../parser'

test('should correctly parse a valid CNPJ', t => {
  const cnpj = '12.345.678/0001-95'
  const result = parser(cnpj)

  t.deepEqual(result.digits, [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 1, 9, 5])
  t.deepEqual(result.fullBody, [1, 2, 3, 4, 5, 6, 7, 8, 0, 0, 0, 1])
  t.deepEqual(result.bodyParts.part1, [1, 2])
  t.deepEqual(result.bodyParts.part2, [3, 4, 5])
  t.deepEqual(result.bodyParts.part3, [6, 7, 8])
  t.deepEqual(result.bodyParts.part4, [0, 0, 0, 1])
  t.deepEqual(result.verifiers, [9, 5])
})

test('should preserve letters while parsing an alphanumeric CNPJ', t => {
  const result = parser('12.ABC.345/01DE-35')

  t.deepEqual(result.digits, [
    1,
    2,
    'A',
    'B',
    'C',
    3,
    4,
    5,
    0,
    1,
    'D',
    'E',
    3,
    5,
  ])
  t.deepEqual(result.fullBody, [1, 2, 'A', 'B', 'C', 3, 4, 5, 0, 1, 'D', 'E'])
  t.deepEqual(result.bodyParts.part1, [1, 2])
  t.deepEqual(result.bodyParts.part2, ['A', 'B', 'C'])
  t.deepEqual(result.bodyParts.part3, [3, 4, 5])
  t.deepEqual(result.bodyParts.part4, [0, 1, 'D', 'E'])
  t.deepEqual(result.verifiers, [3, 5])
})

test('should handle CNPJ with less than 14 digits', t => {
  const cnpj = '12.345'
  const result = parser(cnpj)

  t.deepEqual(result.digits, [1, 2, 3, 4, 5])
  t.deepEqual(result.fullBody, [1, 2, 3, 4, 5])
  t.deepEqual(result.bodyParts.part1, [1, 2])
  t.deepEqual(result.bodyParts.part2, [3, 4, 5])
  t.deepEqual(result.bodyParts.part3, [])
  t.deepEqual(result.bodyParts.part4, [])
  t.deepEqual(result.verifiers, [])
})

test('should handle CNPJ with non-digit characters', t => {
  const cnpj = 'abc.12.345/def-xyz'
  const result = parser(cnpj)

  t.deepEqual(result.digits, [1, 2, 3, 4, 5])
  t.deepEqual(result.fullBody, [1, 2, 3, 4, 5])
  t.deepEqual(result.bodyParts.part1, [1, 2])
  t.deepEqual(result.bodyParts.part2, [3, 4, 5])
  t.deepEqual(result.bodyParts.part3, [])
  t.deepEqual(result.bodyParts.part4, [])
  t.deepEqual(result.verifiers, [])
})

test('should parse an empty input', t => {
  t.deepEqual(parser(''), {
    digits: [],
    fullBody: [],
    bodyParts: { part1: [], part2: [], part3: [], part4: [] },
    verifiers: [],
  })
})

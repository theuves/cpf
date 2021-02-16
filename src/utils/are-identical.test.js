import test from 'ava'
import areIdentical from './are-identical'

test('Should check if all items in an array are identical', t => {
  t.true(areIdentical([1, 1, 1]))
  t.false(areIdentical([1, 2, 3]))
})
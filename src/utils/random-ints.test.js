import test from 'ava'
import randomInts from './random-ints'

test('Should generate a array with random numbers', t => {
  t.true(randomInts(10, 10).length === 10)
  t.true(randomInts(10, 10).every(i => typeof i === 'number'))
  t.true(randomInts(10, 10).every(i => i <= 10))
})
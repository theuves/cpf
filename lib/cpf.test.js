import test from 'ava'
import {
  calcCheckDigits,
  areEqual,
  areIdentical,
  random,
  randomInts,
  format,
  isValid,
  generate
} from './cpf'

test('Should calculate the check digits', t => {
  t.deepEqual(calcCheckDigits([1, 1, 1, 4, 4, 4, 7, 7, 7]), [3, 5])
})

test('Should check if two values are equal', t => {
  t.true(areEqual([4, 2], [4, 2]))
  t.false(areEqual([4, 2], [2, 4]))
})

test('Should check if all items in an array are identical', t => {
  t.true(areIdentical([1, 1, 1]))
  t.false(areIdentical([1, 2, 3]))
})

test('Should generate a array with random numbers', t => {
  t.true(randomInts(10, 10).length === 10)
  t.true(randomInts(10, 10).every(i => typeof i === 'number'))
  t.true(randomInts(10, 10).every(i => i <= 10))
})

test('Should generate a random number', t => {
  t.true(random(10) <= 10)
  t.true(random(20) <= 20)
  t.true(random(30) <= 30)
})

test('Should format CPF numbers', t => {
  t.is(format('11144477735'), '111.444.777-35')
  t.is(format('111.44477735'), '111.444.777-35')
  t.is(format('111.444.77735'), '111.444.777-35')
  t.is(format('111.444.777-35'), '111.444.777-35')
})

test('Should generate formatted CPF numbers', t => {
  t.true(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(generate()))
  t.true(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(generate()))
  t.true(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(generate()))
})

test('Should generate unformatted CPF numbers', t => {
  t.true(/^\d{11}$/.test(generate({ formatted: false })))
  t.true(/^\d{11}$/.test(generate({ formatted: false })))
  t.true(/^\d{11}$/.test(generate({ formatted: false })))
})

test('Should validate CPF numbers', t => {
  t.true(isValid('111.444.777-35'))
  t.false(isValid('111.444.777-42'))
})

test('Should validate CPF numbers by length', t => {
  t.true(isValid('111.444.777-35', { byLength: true }))
  t.true(isValid('111.444.777-42', { byLength: true }))
})

test('Should ignore when all digits are identical', t => {
  t.false(isValid('111.111.111-11'))
  t.false(isValid('444.444.444-44'))
  t.false(isValid('777.777.777-77'))
})
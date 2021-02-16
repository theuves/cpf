const test = require('ava')
const isValid = require('./is-valid')

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
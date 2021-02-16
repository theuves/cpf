const test = require('ava')
const random = require('./random')

test('Should generate a random number', t => {
  t.true(random(10) <= 10)
  t.true(random(20) <= 20)
  t.true(random(30) <= 30)
})
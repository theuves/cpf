const test = require('ava')
const format = require('./format')

test('Should format CPF numbers', t => {
  t.is(format('11144477735'), '111.444.777-35')
  t.is(format('111.44477735'), '111.444.777-35')
  t.is(format('111.444.77735'), '111.444.777-35')
  t.is(format('111.444.777-35'), '111.444.777-35')
})
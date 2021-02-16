const test = require('ava')
const areEqual = require('./are-equal')

test('Should check if two values are equal', t => {
  t.true(areEqual([4, 2], [4, 2]))
  t.false(areEqual([4, 2], [2, 4]))
})
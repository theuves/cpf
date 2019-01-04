'use strict'

const reverseArray = require('../../../lib/utils/reverse-array')

describe('reverseArray:', () => {
  it('deve inverter uma array', () => {
    expect(reverseArray(['a', 'b', 'c'])).toEqual(['c', 'b', 'a'])
    expect(reverseArray(['a', 'b', 'c'])).not.toEqual(['a', 'b', 'c'])
  })
})

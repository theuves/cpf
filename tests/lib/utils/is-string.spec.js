'use strict'

const isString = require('../../../lib/utils/is-string')

describe('isString:', () => {
  it('deve verificar se um valor é uma string', () => {
    expect(isString('hello')).toBeTruthy()
    expect(isString(42)).toBeFalsy()
  })
})

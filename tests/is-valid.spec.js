const isValid = require('../index').isValid

describe('CPF.isValid()', () => {
  it('should check if CPF number is valid', () => {
    expect(isValid('111.444.777-35')).toBeTruthy()
    expect(isValid('11144477735')).toBeTruthy()
    expect(isValid('111.444.777')).toBeFalsy()
    expect(isValid('111.444.777-42')).toBeFalsy()
    expect(isValid('111.111.111-11')).toBeFalsy()
    expect(isValid('')).toBeFalsy()
    expect(isValid('string')).toBeFalsy()
  })
  it('should check if a CPF number has a valid length', () => {
    expect(isValid('111.444.777-35', true)).toBeTruthy()
    expect(isValid('111.444.777', true)).toBeFalsy()
  })
})

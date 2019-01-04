const format = require('../index').format

describe('CPF.format()', () => {
  it('should format a CPF number', () => {
    expect(format('11144477735')).toBe('111.444.777-35')
  })
})

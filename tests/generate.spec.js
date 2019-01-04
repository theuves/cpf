const generate = require('../index').generate
const isValid = require('../index').isValid

describe('CPF.generate()', () => {
  var regex

  beforeEach(() => {
    regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
  })

  it('should generate a valid and formatted CPF number', () => {
    expect(regex.test(generate())).toBeTruthy()
    expect(isValid(generate())).toBeTruthy()
  })
  it('should generate a invalid and formatted CPF number', () => {
    expect(regex.test(generate(true, true))).toBeTruthy()
    expect(isValid(generate(true, true))).toBeFalsy()
  })
  it('should generate a valid and unformatted CPF number', () => {
    expect(regex.test(generate(false))).toBeFalsy()
    expect(isValid(generate(false))).toBeTruthy()
  })
  it('should generate a invalid and unformatted CPF number', () => {
    expect(regex.test(generate(false, true))).toBeFalsy()
    expect(isValid(generate(false, true))).toBeFalsy()
  })
})

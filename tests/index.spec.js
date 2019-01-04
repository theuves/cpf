'use strict'

const CPF = require('../')

describe('CPF:', () => {
  it("deve ter 'calcDv'", () => {
    expect(Boolean(CPF.calcDv)).toBeTruthy()
  })
  it("deve ter 'clear'", () => {
    expect(Boolean(CPF.clear)).toBeTruthy()
  })
  it("deve ter 'format'", () => {
    expect(Boolean(CPF.format)).toBeTruthy()
  })
  it("deve ter 'generate'", () => {
    expect(Boolean(CPF.generate)).toBeTruthy()
  })
  it("deve ter 'isValid'", () => {
    expect(Boolean(CPF.isValid)).toBeTruthy()
  })
})

"use strict";
const Cpf = require('../../build/index');
const format = Cpf.format;

describe("format:", () => {
  it("deve formatar um número de cpf", () => {
    expect(format("11144477735")).toBe("111.444.777-35");
  });
});

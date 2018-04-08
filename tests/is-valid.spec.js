"use strict";

const isValid = require("../lib/is-valid");

describe("isValid:", () => {
  it("deve verificar se um número de cpf é válido", () => {
    expect(isValid("111.444.777-35")).toBeTruthy();
    expect(isValid("11144477735")).toBeTruthy();
    expect(isValid("111.444.777")).toBeFalsy();
    expect(isValid("111.444.777-42")).toBeFalsy();
    expect(isValid("111.111.111-11")).toBeFalsy();
  });
  it("deve verificar se um número de cpf é tem um tamanho válido", () => {
    expect(isValid("111.444.777-35", true)).toBeTruthy();
    expect(isValid("111.444.777", true)).toBeFalsy();
  });
});

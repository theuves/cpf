"use strict";

const isRepeated = require("../../lib/utils/is-repeated");

describe("isRepeated:", () => {
  it("deve verificar se uma string tem todos os caracteres iguais", () => {
    expect(isRepeated("aaa")).toBeTruthy();
    expect(isRepeated("matheus")).toBeFalsy();
  });
});

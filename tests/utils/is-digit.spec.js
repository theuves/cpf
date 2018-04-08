"use strict";

const isDigit = require("../../lib/utils/is-digit");

describe("isDigit:", () => {
  it("deve verificar se um valor é um dígito", () => {
    expect(isDigit("4")).toBeTruthy();
    expect(isDigit(2)).toBeTruthy();
    expect(isDigit("42")).toBeFalsy();
    expect(isDigit(42)).toBeFalsy();
  });
});

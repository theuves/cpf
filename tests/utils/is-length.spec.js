"use strict";

const isLength = require("../../lib/utils/is-length");

describe("isLength:", () => {
  it("deve verificar o tamanho de um valor", () => {
    expect(isLength("abc", 3)).toBeTruthy();
    expect(isLength([1, 2, 3], 3)).toBeTruthy();
    expect(isLength("abcd", 3)).toBeFalsy();
    expect(isLength([1, 2, 3, 4], 3)).toBeFalsy();
  });
});

"use strict";

const randomArray = require("../../lib/utils/random-array");
const isLength = require("../../lib/utils/is-length");

describe("randomArray:", () => {
  it("deve gerar um array com dígitos aleatórios", () => {
    expect(isLength(randomArray(3), 3)).toBeTruthy();
    randomArray(10, 5).forEach(value => {
      expect(value >= 0 || value <= 5).toBeTruthy();
    });
  });
});

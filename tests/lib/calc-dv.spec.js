"use strict";

const calcDv = require("../../lib/calc-dv");

describe("calcDv:", () => {
  it("deve obter os dígitos verificadores dum número de cpf.", () => {
    expect(calcDv([1, 1, 1, 4, 4, 4, 7, 7, 7])).toEqual([3, 5]);
    expect(calcDv("111444777")).toEqual([3, 5]);
  });
});

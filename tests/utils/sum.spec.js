"use strict";

const sum = require("../../lib/utils/sum");

describe("sum:", () => {
  it("deve somar dois valores númericos", () => {
    expect(sum(3, 0.14)).toBe(3.14);
    expect(sum(21, 21)).toBe(42);
  });
});

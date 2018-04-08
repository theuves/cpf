"use strict";

const clear = require("../../lib/clear");

describe("clear:", () => {
  it("deve desformatar um número de cpf", () => {
    expect(clear("111.444.777-35")).toBe("11144477735");
  });
});

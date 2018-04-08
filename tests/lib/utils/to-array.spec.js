"use strict";

const toArray = require("../../../lib/utils/to-array");

describe("toArray:", () => {
  it("deve converter valores em array", () => {
    expect(toArray("123")).toEqual(["1", "2", "3"]);
    expect(toArray(["a", "b", "c"])).toEqual(["a", "b", "c"]);
  });
});

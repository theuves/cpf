"use strict";

const calcDv = require("./calc-dv");
const clear = require("./clear");
const isString = require("./utils/is-string");
const isLength = require("./utils/is-length");

module.exports = (cpf = "", byLength = false) => {
  const ehStr = typeof cpf === "string";

  if (isString(cpf)) {
    const unformattedCpf = clear(cpf);

    if (byLength && isLength(unformattedCpf, 11)) {
      return true;
    }

    const [, number, dv] = unformattedCpf.match(/^(\d{9})(\d{2})$/);
    const trueDv = calcDv(number).join("");

    return dv === trueDv;
  }

  return false;
};

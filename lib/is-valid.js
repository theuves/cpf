"use strict";

const calcDv = require("./calc-dv");
const clear = require("./clear");
const isString = require("./utils/is-string");
const isLength = require("./utils/is-length");
const isRepeated = require("./utils/is-repeated");

module.exports = (cpf = "", byLength = false) => {
  if (isString(cpf)) {
    const unformattedCpf = clear(cpf);

    if (isRepeated(unformattedCpf)) return false;
    if (!isLength(unformattedCpf, 11)) return false;
    if (byLength && isLength(unformattedCpf, 11)) return true;

    const [, number, dv] = unformattedCpf.match(/^(\d{9})(\d{2})$/);
    const trueDv = calcDv(number).join("");

    return dv === trueDv;
  }

  return false;
};

"use strict";

const calcDv = require("./lib/calc-dv");
const clear = require("./lib/clear");
const format = require("./lib/format");
const generate = require("./lib/generate");
const isValid = require("./lib/is-valid");

const CPF = {
  calcDv: calcDv,
  clear: clear,
  format: format,
  generate: generate,
  isValid: isValid
};

module.exports = CPF;

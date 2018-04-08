"use strict";

const isString = require("./utils/is-string");

module.exports = (cpf = "") => {
  if (isString(cpf)) return cpf.replace(/\D/g, "");

  throw new Error("invalid CPF number");
};

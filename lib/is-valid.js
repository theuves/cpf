"use strict";

const calcDv = require("./calc-dv");
const clear = require("./clear");

function isValid(cpf, length = false) {
  const nEhString = typeof cpf !== "string";
  if (nEhString) throw new Error("invalid CPF number");

  const cpfLimpo = clear(cpf);
  const temComprimentoValido = cpfLimpo.length === 11;

  if (length) return temComprimentoValido;
  if (!temComprimentoValido) return false;

  const [, numero, dv] = cpfLimpo.match(/^(\d{9})(\d{2})$/);
  const ehValido = calcDv(numero) === dv;

  return ehValido;
}

module.exports = clear;

"use strict";

const calcDv = require("./calc-dv");
const clear = require("./clear");

function isValid(cpf = "", length = false) {
  const nEhStr = typeof cpf !== "string";
  if (nEhStr) throw new Error("invalid CPF number");

  const cpfLimpo = clear(cpf);
  const temComprimentoValido = cpfLimpo.length === 11;

  if (length) return temComprimentoValido;
  if (!temComprimentoValido) return false;

  const [, numero, dv] = cpfLimpo.match(/^(\d{9})(\d{2})$/);

  const dvVerdadeiro = calcDv(numero);
  const dvVerdadeiroEmStr = dvVerdadeiro.toString();

  const ehValido = dvVerdadeiroEmStr === dv;

  return ehValido;
}

module.exports = isValid;

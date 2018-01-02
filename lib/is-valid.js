"use strict";

const calcDv = require("./calc-dv");
const clear = require("./clear");

function isValid(cpf = "", byLength = false) {
  const porComprimento = byLength;

  const ehStr = typeof cpf === "string";
  if (!ehStr) return false;

  const cpfLimpo = clear(cpf);

  const temComprimentoValido = cpfLimpo.length === 11;
  if (porComprimento || !temComprimentoValido) return temComprimentoValido;

  const [, numero, dv] = cpfLimpo.match(/^(\d{9})(\d{2})$/);

  const dvVerdadeiro = calcDv(numero);
  const dvVerdadeiroEmStr = dvVerdadeiro.toString();

  const cpfEhValido = dvVerdadeiroEmStr === dv;
  return cpfEhValido;
}

module.exports = isValid;

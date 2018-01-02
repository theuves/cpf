"use strict";

module.exports = clear;

function clear(cpf = "") {
  const ehStr = typeof cpf !== "string";

  if (ehStr) throw new Error("invalid CPF number");

  const nDigitos = /\D/g;
  const nada = "";

  const cpfLimpo = cpf.replace(nDigitos, nada);

  return cpfLimpo;
}


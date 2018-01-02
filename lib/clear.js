"use strict";

function clear(cpf = "") {
  const ehStr = typeof cpf === "string";

  if (!ehStr) throw new Error("invalid CPF number");

  const N_DIGITOS = /\D/g;
  const NADA = "";

  const cpfLimpo = cpf.replace(N_DIGITOS, NADA);

  return cpfLimpo;
}

module.exports = clear;

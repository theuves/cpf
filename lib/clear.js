"use strict";

function clear(cpf) {
  const ehString = typeof cpf === "string";

  if (!ehString) throw new Error("invalid CPF number");

  const nNumeros = /\D/g;
  const nada = "";

  const cpfLimpo = cpf.replace(nNumeros, nada);

  return cpfLimpo;
}

module.exports = clear;

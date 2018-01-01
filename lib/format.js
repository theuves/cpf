"use strict"

const clear = require("./clear");

function format(cpf) {
  const nEhStr = typeof cpf !== "string";
  if (nEhStr) throw new Error("invalid CPF number");

  const cpfLimpo = clear(cpf);

  const nTemTamanhoValido = cpfLimpo.length !== 11;
  if (nTemTamanhoValido) throw new Error("invalid CPF number");

  const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
  const mascara = "$1.$2.$3-$4";

  const cpfFormatado = cpfLimpo.replace(regex, mascara);

  return cpfFormatado;
}

module.exports = format;

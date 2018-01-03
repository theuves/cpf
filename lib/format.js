"use strict"

const limpar = require("./clear");

function format(cpf = "") {
  const ehStr = typeof cpf === "string";
  if (!ehStr) throw new Error("invalid CPF number");

  const cpfLimpo = limpar(cpf);

  const temTamanhoValido = cpfLimpo.length === 11;
  if (!temTamanhoValido) throw new Error("invalid CPF number");

  const REGEX = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
  const MASCARA = "$1.$2.$3-$4";

  const cpfFormatado = cpfLimpo.replace(REGEX, MASCARA);

  return cpfFormatado;
}

module.exports = format;

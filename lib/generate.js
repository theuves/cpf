"use strict";

const calcDv = require("./calc-dv");
const formatar = require("./format");

function generate(formatted = true, invalid = false) {
  const formatado = formatted;
  const invalido = invalid;

  const gerarNum = max => () => Math.floor(Math.random() * (max + 1));
  const criarArrAleatoria = (tamanho, max) => Array.from(Array(tamanho), gerarNum(max));

  const digitos = criarArrAleatoria(9, 9);

  if (invalido) {
    const pseudoDv = criarArrAleatoria(2, 9);
    const pseudoCpf = digitos.concat(pseudoDv);
    const pseudoCpfEmStr = pseudoCpf.join("");

    return formatado
      ? formatar(pseudoCpfEmStr)
      : pseudoCpfEmStr;
  }

  const dv = calcDv(digitos);
  const dvEmStr = dv.join("");
  const digitosEmStr = digitos.join("");
  const cpf = digitosEmStr + dvEmStr;

  return formatado
    ? formatar(cpf)
    : cpf;
}

module.exports = generate;

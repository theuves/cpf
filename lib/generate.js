"use strict";

const calcDv = require("./calc-dv");
const clear = require("./clear");
const format = require("./format");

function generate(formatted = true, invalid = false) {
  const randomizar = max => Math.floor(Math.random() * (max + 1));
  const criarArrAleatoria = (quantia, max) => Array(quantia)
    .fill(undefined)
    .map(() => randomizar(max));

  const digitos = criarArrAleatoria(9, 9);

  if (invalid) {
    let pseudoDv = criarArrAleatoria(2, 9);
    let pseudoCpf = digitos.concat(pseudoDv);
    let pseudoCpfEmStr = pseudoCpf.join("");

    return formatted
      ? format(pseudoCpfEmStr)
      : pseudoCpfEmStr;
  }

  const dV = calcDv(digitos, true);
  const digitosEmStr = digitos.join("");
  const cpf = digitosEmStr + dV;

  return formatted
    ? format(cpf)
    : cpf;
}

module.exports = generate;

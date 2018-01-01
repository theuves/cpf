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
    const pseudoDv = criarArrAleatoria(2, 9);
    const pseudoCpf = digitos.concat(pseudoDv);
    const pseudoCpfEmStr = pseudoCpf.join("");

    return formatted
      ? format(pseudoCpfEmStr)
      : pseudoCpfEmStr;
  }

  const dv = calcDv(digitos);
  const dvEmStr = dv.toString();
  const digitosEmStr = digitos.join("");
  const cpf = digitosEmStr + dvEmStr;

  return formatted
    ? format(cpf)
    : cpf;
}

module.exports = generate;

"use strict";

const clear = require("./clear");

function calcDv(digits = []) {
  const ehStr = typeof digits === "string";
  if (ehStr) digits = clear(digits).split("");

  const ehDigito = num => /^[0-9]$/.test(num);

  const ehArray = Array.isArray(digits);
  const saoTdsDigitos = digits.every(ehDigito);
  const temNoveDigitos = digits.length === 9;

  const ehValido = ehArray && saoTdsDigitos && temNoveDigitos;

  if (!ehValido) throw new Error("invalid CPF number");

  const invertido = digits
    .slice()
    .reverse();

  const fazerSomatoria = digitos => {
    const somar = (a, b) => a + b;
    const calcular = (num, i) => num * (9 - (i % 10));

    const dv = digitos
      .map(calcular)
      .reduce(somar);

    return dv;
  };

  const somatoria1 = fazerSomatoria(invertido);
  const somatoria2 = fazerSomatoria([0].concat(invertido));

  const v = [];

  v[0] = somatoria1 % 11 % 10;
  v[1] = (somatoria2 + v[0] * 9) % 11 % 10;

  return v;
}

module.exports = calcDv;

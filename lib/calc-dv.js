"use strict";

const clear = require("./clear");

function calcDv(digits = [], join = false) {
  const ehString = typeof digits === "string";
  if (ehString) digits = clear(digits).split("");

  const ehInt = num => Number.isInteger(Number(num));

  const ehArray = Array.isArray(digits);
  const saoTdsDigitos = digits.every(ehInt);
  const temNoveDigitos = digits.length === 9;

  const ehValido = ehArray && saoTdsDigitos && temNoveDigitos;

  if (!ehValido) throw new Error("invalid CPF number");

  const invertido = digits
    .slice()
    .reverse();

  const fazerSomatoria = digitos => {
    const somar = (a, b) => a + b;
    const calcular = (num, i) => num * (9 - (i % 10));

    const dV = digitos
      .map(calcular)
      .reduce(somar);

    return dV;
  };

  const somatoria1 = fazerSomatoria(invertido);
  const somatoria2 = fazerSomatoria([0].concat(invertido));

  const v = [];

  v[0] = somatoria1 % 11 % 10;
  v[1] = (somatoria2 + v[0] * 9) % 11 % 10;

  return join
    ? v.join("")
    : v;
}

module.exports = calcDv;

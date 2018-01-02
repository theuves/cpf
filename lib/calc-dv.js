"use strict";

function calcDv(digits = []) {
  const ehDigito = val => /^[0-9]$/.test(val);

  const ehArr = Array.isArray(digits);
  const ehStr = typeof digits === "string";

  const ehTipoValido = ehArr || ehStr;
  const saoTdsDigitos = digits.every(ehDigito);
  const temNoveDigitos = digits.length === 9;

  const ehNumValido = ehTipoValido && saoTdsDigitos && temNoveDigitos;

  if (!ehNumValido) throw new Error("invalid digits");

  const fazerSomatoria = digitos => {
    const somar = (a, b) => a + b;
    const calcular = (num, i) => num * (9 - (i % 10));

    const dv = digitos
      .map(calcular)
      .reduce(somar);

    return dv;
  };

  const digitosEmArr = ehStr
    ? digits.split("")
    : digits;

  const digitosInvertido = digitosEmArr
    .concat()
    .reverse();

  const somatoria1 = fazerSomatoria(digitosInvertido);
  const somatoria2 = fazerSomatoria([0].concat(digitosInvertido));

  const v = [];

  v[0] = somatoria1 % 11 % 10;
  v[1] = (somatoria2 + v[0] * 9) % 11 % 10;

  return v;
}

module.exports = calcDv;

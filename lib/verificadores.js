"use strict";

/**
 * Obter os dígitos verificadores de um CPF.
 *
 * @param {Array} cpf - Números do CPF.
 * @returns {String} Dígitos verificadores.
 *
 * @example
 * validate('111.444.777-35'); // true
 */
function verificadores(cpf) {
  cpf = cpf.reverse();

  var v1 = 0;
  var v2 = 0;

  for (var i = 0; i < 9; i++) {
    v1 = v1 + cpf[i] * (9 - (i % 10));
    v2 = v2 + cpf[i] * (9 - ((i + 1) % 10));
  }

  v1 = (v1 % 11) % 10;
  v2 = ((v2 + v1 * 9) % 11) % 10;

  return v1 + "" + v2;
}

module.exports = verificadores;

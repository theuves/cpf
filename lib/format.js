"use strict";

/**
 * Formatar um número de CPF.
 *
 * @param {String} cpf - CPF desformatado.
 * @returns {?String} - CPF formatado.
 *
 * @example
 * format("11144477735"); // "111.444.777-35"
 */
function format(cpf) {
  cpf = cpf
    .toString()
    .trim();

  var formato = /^(\d{3}\.?\d{3}\.?\d{3})-?(\d{2})$/;

  if (!formato.test(cpf)) {
    return null;
  }

  var itens = cpf.match(formato);

  var digitos = itens[1]
    .replace(/\./g, "")
    .replace(/^(\d{3})(\d{3})(\d{3})$/, "$1.$2.$3");

  var verificador = itens[2];

  cpf = digitos + "-" + verificador;

  return cpf;
}

module.exports = format;

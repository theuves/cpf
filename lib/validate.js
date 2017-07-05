"use strict";

var format = require("./format.js");
var verificadores = require("./verificadores.js");

/**
 * Validar um número de CPF.
 *
 * @param {String} cpf - Um número de CPF.
 * @returns {Boolean} Validação.
 *
 * @example
 * validate("111.444.777-35"); // true
 */
function validate(cpf) {
  cpf = cpf.toString();
  cpf = format(cpf);

  if (!cpf) {
    return false;
  }

  var itens = cpf.split("-");

  var digitos = itens[0]
    .replace(/\./g, "")
    .split("");

  var verdadeiro = verificadores(digitos);
  var verificador = itens[1];

  var validacao = verdadeiro === verificador;

  return validacao;
}

module.exports = validate;

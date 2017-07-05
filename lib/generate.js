"use strict";

var embaralhar = require("shuffle-list");
var format = require("./format.js");
var verificadores = require("./verificadores.js");

/**
 * Gerar um número de CPF aleatório.
 *
 * @returns {String} Um CPF aleátorio.
 */
function generate() {
  var lista = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  var digitos = embaralhar(lista)
    .join("")
    .substring(0, 9);

  var verificador = verificadores(digitos.split(""));

  var cpf = digitos + verificador;

  return format(cpf);
}

module.exports = generate;

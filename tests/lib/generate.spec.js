"use strict";

const generate = require("../../lib/generate");
const isValid = require("../../lib/is-valid");

describe("generate:", () => {
  var regex;

  beforeEach(() => {
    regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  });

  it("deve gerar um número de cpf aleatório formatado válido", () => {
    expect(regex.test(generate())).toBeTruthy(); // formatado
    expect(isValid(generate())).toBeTruthy(); // válido
  });
  it("deve gerar um número de cpf aleatório formatado inválido", () => {
    expect(regex.test(generate(true, true))).toBeTruthy(); // formatado
    expect(isValid(generate(true, true))).toBeFalsy(); // válido
  });
  it("deve gerar um número de cpf aleatório desformatado válido", () => {
    expect(regex.test(generate(false))).toBeFalsy(); // desformatado
    expect(isValid(generate(false))).toBeTruthy(); // válido
  });
  it("deve gerar um número de cpf aleatório desformatado inválido", () => {
    expect(regex.test(generate(false, true))).toBeFalsy(); // desformatado
    expect(isValid(generate(false, true))).toBeFalsy(); // válido
  });
});

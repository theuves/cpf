"use strict";

const CPF = require("../");

describe("CPF", () => {
  let cpfSoNumeros;
  let cpfFormatado;
  let cpfDesformatado;
  let cpfSemiFormatado;
  let cpfComTamanhoValido;
  let cpfInvalido;
  let reCpfFormatado;
  let reCpfDesformatado;

  beforeEach(() => {
    cpfFormatado = "111.444.777-35";
    cpfDesformatado = "11144477735";
    cpfSemiFormatado = "111444777-35";
    cpfComTamanhoValido = "00000000000";
    cpfInvalido = "111.444.777-53";
    reCpfFormatado = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    reCpfDesformatado = /^\d{11}$/;
  });

  describe("calcDev(digits)", () => {
    let dv;
    let digitosEmArray;
    let digitosEmString;

    beforeEach(() => {
      dv = [3,5];
      digitosEmArray = [1,1,1,4,4,4,7,7,7];
      digitosEmString = "111444777";
    });

    it("deve obter os dígitos verificadores a partir de array", () => {
      expect(CPF.calcDv(digitosEmArray)).toEqual(dv);
    });
    it("deve obter os dígitos verificadores a partir de string", () => {
      expect(CPF.calcDv(digitosEmString)).toEqual(dv);
    });
  });

  describe("clear(cpf)", () => {
    it("deve remover qualquer caractere não-dígito", () => {
      expect(CPF.clear(cpfFormatado)).toBe(cpfDesformatado);
      expect(CPF.clear(cpfDesformatado)).toBe(cpfDesformatado);
      expect(CPF.clear(cpfSemiFormatado)).toBe(cpfDesformatado);
    });
  });

  describe("format(cpf)", () => {
    it("deve formatar número de cpf formatado", () => {
      expect(CPF.format(cpfFormatado)).toBe(cpfFormatado);
    });
    it("deve formatar número de cpf desformatado", () => {
      expect(CPF.format(cpfDesformatado)).toBe(cpfFormatado);
    });
  });

  describe("isValid(cpf[, length])", () => {
    it("deve validar número de cpf formatado", () => {
      expect(CPF.isValid(cpfFormatado)).toBeTruthy();
    });
    it("deve validar número de cpf desformatado", () => {
      expect(CPF.isValid(cpfDesformatado)).toBeTruthy()
    });
    it("deve validar número de cpf somente pelo tamanho", () => {
      expect(CPF.isValid(cpfComTamanhoValido, true)).toBeTruthy();
    });
  });

  describe("generate([formatted][, invalid])", () => {
    it("deve gerar número de cpf formatado e válido", () => {
      expect(CPF.generate()).toMatch(reCpfFormatado);
      expect(CPF.isValid(CPF.generate())).toBeTruthy()
    });
    it("deve gerar número de cpf desformatado e valido", () => {
      expect(CPF.generate(false)).toMatch(reCpfDesformatado);
      expect(CPF.isValid(CPF.generate(false))).toBeTruthy();
    });
    it("deve gerar número de cpf formatado e inválido", () => {
      expect(CPF.generate(undefined, true)).toMatch(reCpfFormatado);
      expect(CPF.isValid(CPF.generate(undefined, true))).toBeFalsy();
    });
  });
});

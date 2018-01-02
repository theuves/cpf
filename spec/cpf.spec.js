"use strict";

const CPF = require("../");

describe("CPF", () => {
  it("calcDv", () => {
    const DV = [3, 5];
    const EM_ARR = [1, 1, 1, 4, 4, 4, 7, 7, 7];
    const EM_STR = "111444777";

    const dvDeArr = CPF.calcDv(EM_ARR);
    const dvDeStr = CPF.calcDv(EM_STR);

    expect(dvDeStr).toEqual(DV);
    expect(dvDeStr).toEqual(DV);
  });

  it("clear", () => {
    const CPF_FORMATADO = "111.444.777-35";
    const CPF_FORMATADO_TRACO = "111444777-35";
    const CPF_DESFORMATADO = "11144477735";

    const cpfFormatado = CPF.clear(CPF_FORMATADO);
    const cpfDesformatado = CPF.clear(CPF_DESFORMATADO);
    const cpfFormatadoTraco = CPF.clear(CPF_FORMATADO_TRACO);

    expect(cpfFormatado).toBe(CPF_DESFORMATADO);
    expect(cpfDesformatado).toBe(CPF_DESFORMATADO);
    expect(cpfFormatadoTraco).toBe(CPF_DESFORMATADO);
  });

  it("format", () => {
    const CPF_FORMATADO = "111.444.777-35";
    const CPF_DESFORMATADO = "11144477735";

    const cpfFormatado = CPF.format(CPF_FORMATADO);
    const cpfDesformatado = CPF.format(CPF_DESFORMATADO);

    expect(cpfFormatado).toBe(CPF_FORMATADO);
    expect(cpfDesformatado).toBe(CPF_FORMATADO);
  });

  it("isValid", () => {
    const CPF_FORMATADO = "111.444.777-35";
    const CPF_DESFORMATADO = "11144477735";
    const CPF_COM_TAMANHO_VALIDO = "00000000000";
    const CPF_DA_DILMA_ROUSSEFF = "133.267.246-91";

    const cpfFormatado = CPF.isValid(CPF_FORMATADO);
    const cpfDesformatado = CPF.isValid(CPF_DESFORMATADO);
    const cpfComTamanhoValido = CPF.isValid(CPF_COM_TAMANHO_VALIDO);
    const cpfDaDilmaRousseff = CPF.isValid(CPF_DA_DILMA_ROUSSEFF);

    expect(cpfFormatado).toBe(true);
    expect(cpfDesformatado).toBe(true);
    expect(cpfComTamanhoValido).toBe(true);
    expect(cpfDaDilmaRousseff).toBe(true);
  });

  it("generate", () => {
    const cpfFormatado = CPF.generate();
    const cpfDesformatado = CPF.generate(true);
    const cpfInvalido = CPF.generate(undefined, true);

    const ehValidoCpfFormatado = CPF.isValid(cpfFormatado);
    const ehValidoCpfDesformatado = CPF.isValid(cpfDesformatado);
    const ehValidoCpfInvalido = CPF.isValid(cpfInvalido);

    expect(ehValidoCpfFormatado).toBe(true);
    expect(ehValidoCpfDesformatado).toBe(true);
    expect(ehValidoCpfInvalido).not.toBe(true);
  });
});

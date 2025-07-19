export function check(cpf: string, strict: boolean = true): boolean {
  if (strict) {
    const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return pattern.test(cpf);
  } else {
    cpf = cpf.trim();
    const patterns = [
      /^\d{3}\.\d{1,3}$/,
      /^\d{3}\.\d{3}\.\d{1,3}$/,
      /^\d{3}\.\d{3}\.\d{3}-\d{0,2}$/
    ];
    return patterns.some(p => p.test(cpf));
  }
}

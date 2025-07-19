export function check(cpf: string, strict: boolean = true): boolean {
  if (strict) {
    const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return pattern.test(cpf);
  } else {
    cpf = cpf.trim();
    // First check if the string contains only valid characters
    const validChars = /^[\d.\-\s]+$/;
    if (!validChars.test(cpf)) {
      return false;
    }
    const patterns = [
      /^\d{3}\.\d{1,3}$/,
      /^\d{3}\.\d{3}\.\d{1,3}$/,
      /^\d{3}\.\d{3}\.\d{3}-\d{0,2}$/
    ];
    return patterns.some(p => p.test(cpf));
  }
}

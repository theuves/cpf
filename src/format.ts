const mask = {
  cpf(val: string): string {
    /* c8 ignore start */
    return val
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2');
    /* c8 ignore stop */
  },
};

const onlyDigits = (val: string): string => {
  return val.replace(/\D/g, '');
};

/**
 * Format a CPF number.
 *
 * @param cpfNumber - Unformatted CPF number.
 * @returns Formatted CPF number.
 */
export function format(cpfNumber: string): string {
  const digits = onlyDigits(cpfNumber);
  // Take only the first 11 digits
  const truncatedDigits = digits.slice(0, 11);
  return mask.cpf(truncatedDigits);
}

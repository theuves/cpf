const mask = {
  cpf(val: string): string {
    return val
      .replace(/(\d{11})\d/, '$1')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2');
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
  return mask.cpf(digits);
}

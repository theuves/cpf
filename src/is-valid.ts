import { getCD } from './get-cd';

/**
 * Check if a string has only the same character.
 *
 * @param string - String to check.
 * @returns Check result.
 */
const isRepeated = (string: string): boolean => {
  const firstChar = string.charAt(0);
  const regex = RegExp(`^${firstChar}+$`);

  return regex.test(string);
};

/**
 * Check if a number is a CPF valid.
 *
 * @param cpfNumber - CPF number.
 * @param byLength - To check only by the length.
 * @returns Check result.
 */
export function isValid(cpfNumber: string, byLength = false): boolean {
  if (typeof cpfNumber !== 'string') return false;

  const unformattedCpf = cpfNumber.replace(/\D/g, '');

  if (!unformattedCpf) return false;
  if (unformattedCpf.length !== 11) return false;
  if (byLength && unformattedCpf.length === 11) return true;
  if (isRepeated(unformattedCpf)) return false;

  const match = unformattedCpf.match(/^(\d{9})(\d{2})$/);
  if (!match) return false;

  const [, number, dv] = match;
  if (!number || !dv) return false;

  const trueDv = getCD(Array.from(number, Number)).join('');

  return dv === trueDv;
}

import { getCD } from './get-cd';
import { format } from './format';

/**
 * Generate a random digit between 0 and 9.
 *
 * @returns Random digit.
 */
const randomDigit = (): number => {
  return Math.floor(Math.random() * 10);
};

/**
 * Generate an array of random digits.
 *
 * @param length - Length of the array.
 * @returns Array of random digits.
 */
const randomDigits = (length: number): number[] => {
  return Array.from({ length }, randomDigit);
};

/**
 * Generate a random CPF number.
 *
 * @param formatted - To get a formatted number. Default: true
 * @param invalid - To get invalid number. Default: false
 * @returns CPF number.
 */
export function generate(formatted = true, invalid = false): string {
  const digits = randomDigits(9);

  const dv = invalid ? randomDigits(2) : getCD(digits);

  const cpfNumber = [...digits, ...dv].join('');

  return formatted ? format(cpfNumber) : cpfNumber;
}

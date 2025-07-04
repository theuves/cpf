/**
 * Check if a value is a digit.
 *
 * @param val - Any value.
 * @return Check result.
 */
const isDigit = (val: unknown): val is string => {
  return typeof val === 'string' && /^\d$/.test(val);
};

/**
 * Sum two numbers.
 *
 * @param a - Number to sum.
 * @param b - Other number to sum.
 * @return Sum result.
 */
const sum = (a: number, b: number): number => {
  return a + b;
};

/**
 * Do a internal calculation of the CPF algorithm.
 *
 * @param nums - Array of numbers.
 * @returns Operation result.
 */
const calc = (nums: number[]): number => {
  return nums
    .map((num, i) => num * (9 - (i % 10)))
    .reduce(sum);
};

/**
 * Get the check digits of a CPF number.
 *
 * @param digits - Nine digits of a CPF number.
 * @returns Check digits.
 */
export function getCD(digits: number[] = []): number[] {
  const arrayDigits = Array.from(digits || []);

  if (arrayDigits.length !== 9 || !arrayDigits.every(digit => digit >= 0 && digit <= 9)) {
    throw new Error('Invalid digits');
  }

  const reversed = [...arrayDigits].reverse();
  const cd: number[] = [];

  cd[0] = calc(reversed) % 11 % 10;
  cd[1] = (calc([0, ...reversed]) + cd[0] * 9) % 11 % 10;

  return cd;
} 
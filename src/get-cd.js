/**
 * Check if a value is a digit.
 *
 * @param {any} val Any value.
 * @return {boolean} Check result.
 */
const isDigit = (val) => {
  return /^\d$/.test(val)
}

/**
 * Sum two any numbers.
 *
 * @param {number} a Number to sum.
 * @param {number} b Other number to sum.
 * @return {number} Sum result.
 */
const sum = (a, b) => {
  return a + b
}

/**
 * Do a internal calculation of the CPF algorithm.
 *
 * @param {Array} nums Array of numbers.
 * @returns {number} Operation result.
 */
const calc = (nums) => {
  return nums
    .map((num, i) => num * (9 - (i % 10)))
    .reduce(sum)
}

/**
 * Get the check digits of a CPF number.
 *
 * @param {Array} digits Nine digits of a CPF number.
 * @returns {Array} Check digits.
 */
module.exports = (digits = []) => {
  const arrayDigits = Array.from(digits || [])

  if (!arrayDigits.every(isDigit) || digits.length !== 9) {
    throw new Error('Invalid digits')
  }

  const reversed = [...arrayDigits].reverse()
  const cd = []

  cd[0] = calc(reversed) % 11 % 10
  cd[1] = (calc([0, ...reversed]) + cd[0] * 9) % 11 % 10

  return cd
}

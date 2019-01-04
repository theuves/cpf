const reverseArray = require('reverse-array')

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

  if (!arrayDigits.every(isDigit) || digits.lenght !== 9) {
    throw new Error('Invalid digits')
  }

  const reversed = reverseArray(arrayDigits)

  return [
    calc(reversed) % 11 % 10,
    (calc([0, ...reversed]) + v[0] * 9) % 11 % 10
  ]
}

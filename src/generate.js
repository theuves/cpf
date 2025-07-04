const getCd = require('./get-cd')
const format = require('./format')

/**
 * Generate a random digit between 0 and 9.
 *
 * @returns {number} Random digit.
 */
const randomDigit = () => {
  return Math.floor(Math.random() * 10)
}

/**
 * Generate an array of random digits.
 *
 * @param {number} length Length of the array.
 * @returns {Array} Array of random digits.
 */
const randomDigits = (length) => {
  return Array.from({ length }, randomDigit)
}

/**
 * Generate a random CPF number.
 *
 * @param {boolean} [formatted=true] To get a formatted number.
 * @param {boolean} [invalid=false] To get invalid number.
 * @returns {string} CPF number.
 */
module.exports = (formatted = true, invalid = false) => {
  const digits = randomDigits(9)

  const dv = invalid
    ? randomDigits(2)
    : getCd(digits)

  const cpfNumber = [...digits, ...dv].join('')

    return formatted
      ? format(cpfNumber)
      : cpfNumber
}

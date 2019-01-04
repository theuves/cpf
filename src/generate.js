const randomArray = require('random-array')
const getCd = require('./get-cd')
const format = require('./format')

/**
 * Generate a random CPF number.
 *
 * @param {boolean} [formatted=true] To get a formatted number.
 * @param {boolean} [invalid=false] To get invalid number.
 * @returns {string} CPF number.
 */
module.exports = (formatted = true, invalid = false) => {
  const digits = randomArray(0, 9).oned(9, { round: true })

  const dv = invalid
    ? randomArray(0, 9).oned(2, { round: true })
    : getCd(digits)

  const cpfNumber = [...digits, ...dv].join('')

    return formatted
      ? format(cpfNumber)
      : cpfNumber
}

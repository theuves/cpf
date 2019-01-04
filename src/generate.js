const reverseArray = require('reverse-array')
const calcCd = require('./calc-cd')
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

  if (invalid) {
    const dv = randomArray(2, 9)
    const cpf = [...digits, ...dv].join('')

    return formatted
      ? format(cpf)
      : cpf
  }

  const dv = calcCd(digits)
  const cpf = [...digits, ...dv].join('')

  return formatted
    ? format(cpf)
    : cpf
}

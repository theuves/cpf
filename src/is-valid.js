const areEqual = require('./utils/are-equal')
const areIdentical = require('./utils/are-identical')
const getCheckDigits = require('./core/get-check-digits')

/**
 * Check if CPF number is valid
 * @param {string} cpf A CPF number to validate
 * @param {object} options Options
 * @example
 * isValid('111.444.777-35')
 * //-> true
 * isValid('111.444.777-42', { byLength: true })
 * //-> true
 */
function isValid(cpf, options = {
  byLength: false
}) {
  if (typeof cpf !== 'string') throw new TypeError('Must be a string')
  const digits = [...cpf.replace(/\D/g, '')].map(Number)

  // Must have 11 digits
  if (digits.length !== 11) return false
  // Check if all digits are the same (ignore CPFs like '111.111.111-11')
  if (areIdentical(digits)) return false
  // Check if has 11 digits
  if (options.byLength) return true

  const baseDigits = digits.slice(0, 9)
  const checkDigits = digits.slice(9)
  return areEqual(checkDigits, getCheckDigits(baseDigits))
}

module.exports = isValid
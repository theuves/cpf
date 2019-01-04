const getCd = require('./get-cd')

/**
 * Check if a string has only the same character.
 *
 * @param {string} string String to check.
 * @returns {boolean} Check result.
 */
const isRepeated = (string) => {
  const firstChar = string.charAt(0)
  const regex = RegExp(`^${firstChar}+$`)

  return regex.test(string)
}

/**
 * Check if a number is a CPF valid.
 *
 * @param {string} cpf CPF number.
 * @param {boolean} byLength To check only by the length.
 * @returns {boolean} Check result.
 */
module.exports = (cpf, byLength = false) => {
  if (typeof cpf !== 'string') return false

  const unformattedCpf = cpf.replace(/\D/g, '')

  if (!unformattedCpf) return false
  if (isRepeated(unformattedCpf)) return false
  if (unformattedCpf.length !== 11) return false
  if (byLength && unformattedCpf.length === 11) return true

  const [, number, dv] = unformattedCpf.match(/^(\d{9})(\d{2})$/)
  const trueDv = getCd(number).join('')

  return dv === trueDv
}

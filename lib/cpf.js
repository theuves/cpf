/**
 * Format a CPF number.
 *
 * @param {string} cpf
 * @returns {string}
 * @api public
 */
export function format(cpf) {
  if (typeof cpf !== 'string') throw new TypeError('Must be a string')
  const digits = cpf.replace(/\D/g, '')

  // Must have 11 digits
  if (digits.length !== 11) throw new Error('Invalid CPF number')

  const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
  const mask = '$1.$2.$3-$4'
  return digits.replace(regex, mask)
}

/**
 * Check if a CPF number is valid.
 *
 * Options:
 *  - byLength -- do not compare the check digits
 *
 * @param {string} cpf
 * @param {object} [options]
 * @returns {boolean}
 * @api public
 */
export function isValid(cpf, options = {
  byLength: false
}) {
  if (typeof cpf !== 'string') throw new TypeError('Must be a string')
  const digits = Array
    .from(cpf.replace(/\D/g, ''))
    .map(Number)

  // Must have 11 digits
  if (digits.length !== 11) return false
  // Check if all digits are the same (ignore CPFs like '111.111.111-11')
  if (areIdentical(digits)) return false
  // Check if has 11 digits
  if (options.byLength) return true

  const baseDigits = digits.slice(0, 9)
  const checkDigits = digits.slice(9)
  return areEqual(checkDigits, calcCheckDigits(baseDigits))
}

/**
 * Generate a random CPF number.
 *
 * Options:
 *  - valid -- generate a valid CPF number
 *  - formatted -- generate a formatted CPF number
 *
 * @param {object} [options]
 * @returns {string}
 * @api public
 */
export function generate(options = {
  valid: true,
  formatted: true,
}) {
  const { valid, formatted } = options
  const digits = randomInts(9, 9)
  const checkDigits = valid ? calcCheckDigits(digits) : randomInts(2, 9)
  const cpf = [...digits, ...checkDigits].join('')
  return formatted ? format(cpf) : cpf
}

/**
 * Calculate the check digits of a CPF number.
 *
 * @param {number[]} digits
 * @returns {number[]}
 * @api private
 */
export function calcCheckDigits(digits) {
  // Algorithm found in Wikipedia <https://w.wiki/zcv> (pt-BR)
  if (!Array.isArray(digits)) throw new TypeError('Must be an array')
  if (digits.length !== 9) throw new Error('Must have 9 digits')
  const checkDigits = [0, 0]
  digits.reverse()
  for (let index = 0; index < digits.length; index++) {
    checkDigits[0] += digits[index] * (9 - (index % 10))
    checkDigits[1] += digits[index] * (9 - ((index + 1) % 10))
  }
  checkDigits[0] = (checkDigits[0] % 11) % 10
  checkDigits[1] = ((checkDigits[1] + checkDigits[0] * 9) % 11) % 10
  return checkDigits
}

/**
 * Check if two values are equal.
 *
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 * @api private
 */
export function areEqual(a, b) {
  const strA = JSON.stringify(a)
  const strB = JSON.stringify(b)
  return strA === strB
}

/**
 * Check if all items in an array are identical.
 *
 * @param {Array} array
 * @return {boolean}
 * @api private
 */
export function areIdentical(array = []) {
  if (!Array.isArray(array)) throw new TypeError('Must be an array')
  return array.every((value, index, self) => {
    // Ignore the first item
    if (index === 0) return true
    // The current item must be equals the previous
    const current = JSON.stringify(value)
    const previous = JSON.stringify(self[index - 1])
    return current === previous
  })
}

/**
 * Generate a random number.
 *
 * @param {number} max
 * @return {number}
 * @api private
 */
export function random(max = 0) {
  return Math.floor(Math.random() * max + 1)
}

/**
 * Generate a array with random digits.
 *
 * @param {number} length
 * @param {number} max
 * @return {number}
 * @api private
 */
export function randomInts(length = 1, max = 1) {
  return Array
    .from(Array(length)) // create
    .map(() => random(max)) // fill
}

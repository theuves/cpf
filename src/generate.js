import getCheckDigits from './core/get-check-digits'
import randomInts from './utils/random-ints'
import format from './format'

/**
 * Generate a random CPF number
 * @param {object} options Options
 * @return {number} Random CPF number
 */
export default function generate(options = {
  valid: true,
  formatted: true,
}) {
  const { valid, formatted } = options
  const digits = randomInts(9, 9)
  const checkDigits = valid ? getCheckDigits(digits) : randomInts(2, 9)
  const cpf = [...digits, ...checkDigits].join('')
  return formatted ? format(cpf) : cpf
}
import getCheckDigits from './core/get-check-digits'
import random from './utils/random'
import format from './format'

export default function generate(options = {
  valid: true,
  formatted: true,
}) {
  const digits = Array.from(Array(9)).map(() => random(9))
  const checkDigits = options.valid
    ? getCheckDigits(digits)
    : Array.from(Array(2)).map(() => random(9))
  const cpf = [...digits, ...checkDigits].join('')
  return options.formatted
    ? format(cpf)
    : cpf
}
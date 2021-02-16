const getCheckDigits = require('./core/get-check-digits')
const random = require('./utils/random')
const format = require('./format')

function generate(options = {
  valid: true,
  formatted: true,
}) {
  const digits = [...Array(9)].map(() => random(9))
  const checkDigits = options.valid
    ? getCheckDigits(digits)
    : [...Array(2)].map(() => random(9))
  const cpf = [...digits, ...checkDigits].join('')
  return options.formatted
    ? format(cpf)
    : cpf
}

module.exports = generate
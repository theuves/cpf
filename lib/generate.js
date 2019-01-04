'use strict'

const calcDv = require('./calc-dv')
const format = require('./format')
const randomArray = require('./utils/random-array')

module.exports = (formatted = true, invalid = false) => {
  const digits = randomArray(9, 9)

  if (invalid) {
    const dv = randomArray(2, 9)
    const cpf = [...digits, ...dv].join('')

    return formatted
      ? format(cpf)
      : cpf
  }

  const dv = calcDv(digits)
  const cpf = [...digits, ...dv].join('')

  return formatted
    ? format(cpf)
    : cpf
}

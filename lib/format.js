'use strict'

const clear = require('./clear')
const isLength = require('./utils/is-length')
const isString = require('./utils/is-string')

module.exports = (cpf = '') => {
  if (isString(cpf)) {
    const unformattedCpf = clear(cpf)

    if (isLength(unformattedCpf, 11)) {
      return unformattedCpf.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        '$1.$2.$3-$4'
      )
    }
  }

  throw new Error('invalid CPF number')
}

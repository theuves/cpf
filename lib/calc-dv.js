'use strict'

const isDigit = require('./utils/is-digit')
const isLength = require('./utils/is-length')
const reverseArray = require('./utils/reverse-array')
const sum = require('./utils/sum')
const toArray = require('./utils/to-array')

module.exports = (digits = []) => {
  const arrayDigits = toArray(digits)
  const isValid = arrayDigits.every(isDigit) && isLength(digits, 9)

  if (isValid) {
    const calc = numbers => numbers
      .map((num, i) => num * (9 - (i % 10)))
      .reduce(sum)

    const reversed = reverseArray(arrayDigits)
    const v = []

    v[0] = calc(reversed) % 11 % 10
    v[1] = (calc([0, ...reversed]) + v[0] * 9) % 11 % 10

    return v
  }

  throw new Error('invalid digits')
}

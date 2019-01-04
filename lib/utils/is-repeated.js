'use strict'

const split = str => str ? str.split('') : ['']

const reduce = val => val.reduce((a, b) => a === b ? a : '')

const isRepeated = str => Boolean(reduce(split(str)))

module.exports = isRepeated

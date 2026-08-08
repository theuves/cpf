import test from 'ava'
import generate from '../generate'
import validate from '../validate'

test('should generate a single formatted CPF by default', t => {
  const cpf = generate()
  t.is(typeof cpf, 'string')
  t.regex(cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
})

test('should generate multiple formatted CPFs when count is specified', t => {
  const count = 5
  const cpfs = generate({ count })
  t.true(Array.isArray(cpfs))
  t.is(cpfs.length, count)

  // Using regex instead of the format() function to minimize dependencies.
  cpfs.forEach(cpf => {
    t.regex(cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
  })
})

test('should generate unformatted CPF when formatted is false', t => {
  const cpf = generate({ formatted: false })
  t.is(typeof cpf, 'string')
  t.regex(cpf, /^\d{11}$/)
})

test('should generate multiple unformatted CPFs when count is specified', t => {
  const count = 3
  const cpfs = generate({ count, formatted: false })
  t.true(Array.isArray(cpfs))
  t.is(cpfs.length, count)
  cpfs.forEach(cpf => {
    t.regex(cpf, /^\d{11}$/)
  })
})

test('should always generate a valid CPF by default', t => {
  const cpfs = generate({ count: 100 })
  t.true(cpfs.every(cpf => validate(cpf)))
})

test('should always generate an invalid CPF when requested', t => {
  const cpfs = generate({ count: 100, valid: false })
  t.true(cpfs.every(cpf => !validate(cpf)))
})

test('should reject a non-positive or non-integer count', t => {
  for (const count of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    t.throws(() => generate({ count }), {
      message: 'Count must be a positive integer',
    })
  }
})

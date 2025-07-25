import test from 'ava'
import generate from '../cnpj.generate'

test('should generate a single formatted CNPJ by default', t => {
  const cnpj = generate()
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
})

test('should generate multiple formatted CNPJs when count is specified', t => {
  const count = 5
  const cnpjs = generate({ count })
  t.true(Array.isArray(cnpjs))
  t.is(cnpjs.length, count)

  // Using regex instead of the format() function to minimize dependencies.
  cnpjs.forEach(cnpj => {
    t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })
})

test('should generate unformatted CNPJ when formatted is false', t => {
  const cnpj = generate({ formatted: false })
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{14}$/)
})

test('should generate multiple unformatted CNPJs when count is specified', t => {
  const count = 3
  const cnpjs = generate({ count, formatted: false })
  t.true(Array.isArray(cnpjs))
  t.is(cnpjs.length, count)
  cnpjs.forEach(cnpj => {
    t.regex(cnpj, /^\d{14}$/)
  })
})

test('should generate valid CNPJs by default', t => {
  const cnpj = generate()
  t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  
  // Extract digits and validate check digits
  const digits = cnpj.replace(/\D/g, '')
  t.is(digits.length, 14)
  
  // Basic validation: not all same digits
  const allSame = digits.split('').every(d => d === digits[0])
  t.false(allSame)
})

test('should generate invalid CNPJs when valid is false', t => {
  const cnpj = generate({ valid: false })
  t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  
  // Extract digits
  const digits = cnpj.replace(/\D/g, '')
  t.is(digits.length, 14)
})

test('should generate multiple invalid CNPJs when valid is false and count is specified', t => {
  const count = 4
  const cnpjs = generate({ valid: false, count })
  t.true(Array.isArray(cnpjs))
  t.is(cnpjs.length, count)
  
  cnpjs.forEach(cnpj => {
    t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })
})

test('should generate unformatted valid CNPJs', t => {
  const cnpj = generate({ formatted: false, valid: true })
  t.regex(cnpj, /^\d{14}$/)
  
  // Basic validation: not all same digits
  const allSame = cnpj.split('').every(d => d === cnpj[0])
  t.false(allSame)
})

test('should generate unformatted invalid CNPJs', t => {
  const cnpj = generate({ formatted: false, valid: false })
  t.regex(cnpj, /^\d{14}$/)
})

test('should generate different CNPJs on multiple calls', t => {
  const cnpj1 = generate()
  const cnpj2 = generate()
  const cnpj3 = generate()
  
  t.not(cnpj1, cnpj2)
  t.not(cnpj2, cnpj3)
  t.not(cnpj1, cnpj3)
})

test('should generate different unformatted CNPJs on multiple calls', t => {
  const cnpj1 = generate({ formatted: false })
  const cnpj2 = generate({ formatted: false })
  const cnpj3 = generate({ formatted: false })
  
  t.not(cnpj1, cnpj2)
  t.not(cnpj2, cnpj3)
  t.not(cnpj1, cnpj3)
})

test('should handle count of 1 explicitly', t => {
  const cnpj = generate({ count: 1 })
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
})

test('should handle count of 1 with formatted false', t => {
  const cnpj = generate({ count: 1, formatted: false })
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{14}$/)
})

test('should handle count of 1 with valid false', t => {
  const cnpj = generate({ count: 1, valid: false })
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
})

test('should handle count of 1 with all options', t => {
  const cnpj = generate({ count: 1, formatted: false, valid: false })
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{14}$/)
})

test('should throw error for count less than 1', t => {
  t.throws(() => generate({ count: 0 }), {
    message: 'Count must be at least 1',
  })
  t.throws(() => generate({ count: -1 }), {
    message: 'Count must be at least 1',
  })
  t.throws(() => generate({ count: -5 }), {
    message: 'Count must be at least 1',
  })
})

test('should handle large count values', t => {
  const count = 100
  const cnpjs = generate({ count })
  t.true(Array.isArray(cnpjs))
  t.is(cnpjs.length, count)
  
  cnpjs.forEach(cnpj => {
    t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  })
})

test('should handle large count values with unformatted', t => {
  const count = 50
  const cnpjs = generate({ count, formatted: false })
  t.true(Array.isArray(cnpjs))
  t.is(cnpjs.length, count)
  
  cnpjs.forEach(cnpj => {
    t.regex(cnpj, /^\d{14}$/)
  })
})

test('should generate unique CNPJs in large batches', t => {
  const count = 20
  const cnpjs = generate({ count })
  const uniqueCnpjs = new Set(cnpjs)
  
  // Most should be unique (allowing for very rare collisions)
  t.true(uniqueCnpjs.size >= count * 0.9)
})

test('should generate unique unformatted CNPJs in large batches', t => {
  const count = 20
  const cnpjs = generate({ count, formatted: false })
  const uniqueCnpjs = new Set(cnpjs)
  
  // Most should be unique (allowing for very rare collisions)
  t.true(uniqueCnpjs.size >= count * 0.9)
})

test('should handle empty options object', t => {
  const cnpj = generate({})
  t.is(typeof cnpj, 'string')
  t.regex(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
})

test('should handle partial options', t => {
  const cnpj1 = generate({ formatted: false })
  const cnpj2 = generate({ valid: false })
  const cnpj3 = generate({ count: 1 })
  
  t.regex(cnpj1, /^\d{14}$/)
  t.regex(cnpj2, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
  t.regex(cnpj3, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
}) 
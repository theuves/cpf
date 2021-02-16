import test from 'ava'
import generate from './generate'

test('Should generate formatted CPF numbers', t => {
  t.true(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(generate()))
  t.true(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(generate()))
  t.true(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(generate()))
})

test('Should generate unformatted CPF numbers', t => {
  t.true(/^\d{11}$/.test(generate({ formatted: false })))
  t.true(/^\d{11}$/.test(generate({ formatted: false })))
  t.true(/^\d{11}$/.test(generate({ formatted: false })))
})

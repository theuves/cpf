import test from 'ava'
import cnpj from '../index'

test('repairs a missing sole letter without requiring an explicit kind', t => {
  const broken = '?1222333000181'
  const candidates = cnpj.findValidRepairs(broken)

  t.deepEqual(candidates, [
    '11222333000181',
    'G1222333000181',
    'R1222333000181',
  ])
  t.true(candidates.every(cnpj.isValid))
  t.deepEqual(cnpj.findValidRepairs(broken, { kind: 'numeric' }), [
    '11222333000181',
  ])
  t.deepEqual(cnpj.findValidRepairs(broken, { kind: 'alphanumeric' }), [
    'G1222333000181',
    'R1222333000181',
  ])
})

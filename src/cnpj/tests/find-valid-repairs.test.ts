import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import cnpj from '../index'

test('repairs a missing sole letter without requiring an explicit kind', () => {
  const broken = '?1222333000181'
  const candidates = cnpj.findValidRepairs(broken)

  assert.deepStrictEqual(candidates, [
    '11222333000181',
    'G1222333000181',
    'R1222333000181',
  ])
  assert.strictEqual(candidates.every(cnpj.isValid), true)
  assert.deepStrictEqual(cnpj.findValidRepairs(broken, { kind: 'numeric' }), [
    '11222333000181',
  ])
  assert.deepStrictEqual(
    cnpj.findValidRepairs(broken, { kind: 'alphanumeric' }),
    ['G1222333000181', 'R1222333000181']
  )
})

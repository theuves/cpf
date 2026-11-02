import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import getKind from '../get-kind'

test('should identify numeric and alphanumeric CNPJs', () => {
  assert.strictEqual(getKind('11.222.333/0001-81'), 'numeric')
  assert.strictEqual(getKind('12.ABC.345/01DE-35'), 'alphanumeric')
  assert.strictEqual(getKind('12ABC34501DE36'), 'alphanumeric')
})

test('should return null when the CNPJ structure cannot be classified', () => {
  assert.strictEqual(getKind(null), null)
  assert.strictEqual(getKind('12.abc.345/01de-35'), null)
  assert.strictEqual(getKind('12.ABC'), null)
  assert.strictEqual(getKind('12.ABC.345/01DE-3A'), null)
})

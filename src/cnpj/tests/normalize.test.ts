import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import normalize from '../normalize'
import parse from '../parse'

test('should normalize ASCII lowercase letters and preserve partial inputs', () => {
  assert.strictEqual(normalize('12.abc.345/01de-35'), '12ABC34501DE35')
  assert.strictEqual(normalize('00.abc'), '00ABC')
  assert.strictEqual(normalize(''), '')
})

test('should reject Unicode characters that uppercase to ASCII', () => {
  for (const input of [
    '12ßC34501DE33',
    '12ABC34501Dı35',
    '12ABC34501Dſ35',
    '12ﬀC34501DE33',
  ]) {
    assert.throws(() => normalize(input), {
      message: 'Invalid characters in CNPJ input',
    })
    assert.throws(() => parse(input), {
      message: 'Invalid characters in CNPJ input',
    })
  }
})

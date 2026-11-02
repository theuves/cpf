import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import inspect from '../inspect'

test('should inspect a valid CPF', () => {
  assert.deepStrictEqual(inspect('529.982.247-25'), {
    valid: true,
    normalized: '52998224725',
  })
})

test('should diagnose invalid CPF inputs', () => {
  assert.deepStrictEqual(inspect(null), {
    valid: false,
    normalized: null,
    issue: 'INVALID_TYPE',
  })
  assert.deepStrictEqual(inspect('529.982.247-2A'), {
    valid: false,
    normalized: null,
    issue: 'INVALID_CHARACTERS',
  })
  assert.deepStrictEqual(inspect(''), {
    valid: false,
    normalized: '',
    issue: 'INVALID_LENGTH',
  })
  assert.deepStrictEqual(inspect('529.982'), {
    valid: false,
    normalized: '529982',
    issue: 'INVALID_LENGTH',
  })
  assert.deepStrictEqual(inspect('000.000.000-00'), {
    valid: false,
    normalized: '00000000000',
    issue: 'REPEATED_CHARACTERS',
  })
  assert.deepStrictEqual(inspect('529.982.247-26'), {
    valid: false,
    normalized: '52998224726',
    issue: 'INVALID_CHECK_DIGITS',
  })
})

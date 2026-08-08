import test from 'ava'
import inspect from '../inspect'

test('should inspect a valid CPF', t => {
  t.deepEqual(inspect('529.982.247-25'), {
    valid: true,
    normalized: '52998224725',
  })
})

test('should diagnose invalid CPF inputs', t => {
  t.deepEqual(inspect(null), {
    valid: false,
    normalized: null,
    issue: 'INVALID_TYPE',
  })
  t.deepEqual(inspect('529.982.247-2A'), {
    valid: false,
    normalized: null,
    issue: 'INVALID_CHARACTERS',
  })
  t.deepEqual(inspect(''), {
    valid: false,
    normalized: '',
    issue: 'INVALID_LENGTH',
  })
  t.deepEqual(inspect('529.982'), {
    valid: false,
    normalized: '529982',
    issue: 'INVALID_LENGTH',
  })
  t.deepEqual(inspect('000.000.000-00'), {
    valid: false,
    normalized: '00000000000',
    issue: 'REPEATED_CHARACTERS',
  })
  t.deepEqual(inspect('529.982.247-26'), {
    valid: false,
    normalized: '52998224726',
    issue: 'INVALID_CHECK_DIGITS',
  })
})

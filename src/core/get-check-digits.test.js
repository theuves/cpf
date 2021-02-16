import test from 'ava'
import getCheckDigits from './get-check-digits'

test('Should calculate the check digits', t => {
  t.deepEqual(getCheckDigits([1, 1, 1, 4, 4, 4, 7, 7, 7]), [3, 5])
})
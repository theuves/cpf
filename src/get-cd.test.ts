import test from 'ava';
import { getCD } from './get-cd';

test('getCD should throw for invalid digits length', t => {
  t.throws(() => getCD([]), { message: 'Invalid digits' });
});

test('getCD should throw for non-digit values', t => {
  t.throws(() => getCD([1,2,3,4,5,6,7,8,10]), { message: 'Invalid digits' });
});

test('getCD should throw for non-integer digits', t => {
  t.throws(() => getCD([1,2,3,4,5,6,7,8, -1]), { message: 'Invalid digits' });
});

test('getCD should return correct check digits for valid input', t => {
  t.deepEqual(getCD([1,2,3,4,5,6,7,8,9]), [0,9]);
}); 
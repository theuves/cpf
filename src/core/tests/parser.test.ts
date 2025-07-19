import test from 'ava';
import { parser } from '../parser';

test('should correctly parse a valid CPF', t => {
  const cpf = '123.456.789-09';
  const result = parser(cpf);

  t.deepEqual(result.digits, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 9]);
  t.deepEqual(result.fullBody, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  t.deepEqual(result.bodyParts.part1, [1, 2, 3]);
  t.deepEqual(result.bodyParts.part2, [4, 5, 6]);
  t.deepEqual(result.bodyParts.part3, [7, 8, 9]);
  t.is(result.lastBodyDigit, 9);
  t.deepEqual(result.verifiers, [0, 9]);
});

test('should handle CPF with less than 11 digits', t => {
  const cpf = '123.45';
  const result = parser(cpf);

  t.deepEqual(result.digits, [1, 2, 3, 4, 5]);
  t.deepEqual(result.fullBody, [1, 2, 3, 4, 5]);
  t.deepEqual(result.bodyParts.part1, [1, 2, 3]);
  t.deepEqual(result.bodyParts.part2, [4, 5]);
  t.deepEqual(result.bodyParts.part3, []);
  t.is(result.lastBodyDigit, null);
  t.deepEqual(result.verifiers, []);
});

test('should handle CPF with non-digit characters', t => {
  const cpf = 'abc.123.456-xyz';
  const result = parser(cpf);

  t.deepEqual(result.digits, [1, 2, 3, 4, 5, 6]);
  t.deepEqual(result.fullBody, [1, 2, 3, 4, 5, 6]);
  t.deepEqual(result.bodyParts.part1, [1, 2, 3]);
  t.deepEqual(result.bodyParts.part2, [4, 5, 6]);
  t.deepEqual(result.bodyParts.part3, []);
  t.is(result.lastBodyDigit, null);
  t.deepEqual(result.verifiers, []);
});

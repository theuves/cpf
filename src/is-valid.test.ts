import test from 'ava';
import { isValid } from './is-valid';

test('isValid should validate correct CPF numbers', (t) => {
  t.true(isValid('123.456.789-09'));
  t.true(isValid('111.444.777-35'));
  t.true(isValid('12345678909'));
});

test('isValid should reject invalid CPF numbers', (t) => {
  t.false(isValid('123.456.789-10'));
  t.false(isValid('111.111.111-11'));
  t.false(isValid('000.000.000-00'));
});

test('isValid should reject CPF with wrong length', (t) => {
  t.false(isValid('123.456.789-0'));
  t.false(isValid('1234567890'));
  t.false(isValid('123.456.789-012'));
});

test('isValid should reject non-string inputs', (t) => {
  t.false(isValid(null as any));
  t.false(isValid(undefined as any));
  t.false(isValid(12345678909 as any));
});

test('isValid should validate by length only when byLength is true', (t) => {
  t.true(isValid('123.456.789-10', true));
  t.true(isValid('111.111.111-11', true));
  t.false(isValid('123.456.789-0', true));
}); 
import test from 'ava';
import { format } from './format';

test('format should format CPF correctly', t => {
  t.is(format('12345678901'), '123.456.789-01');
  t.is(format('11111111111'), '111.111.111-11');
  t.is(format('00000000000'), '000.000.000-00');
});

test('format should handle already formatted CPF', t => {
  t.is(format('123.456.789-01'), '123.456.789-01');
  t.is(format('111.111.111-11'), '111.111.111-11');
});

test('format should handle CPF with extra characters', t => {
  t.is(format('123.456.789-01abc'), '123.456.789-01');
  t.is(format('abc12345678901def'), '123.456.789-01');
});

test('format should handle CPF with less than 11 digits', t => {
  t.is(format('1234567890'), '123.456.789-0');
  t.is(format('123456789'), '123.456.789');
});

test('format should handle CPF with more than 11 digits', t => {
  t.is(format('123456789012345'), '123.456.789-01');
});

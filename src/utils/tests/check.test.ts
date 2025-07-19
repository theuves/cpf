import test from 'ava';
import { check } from '../check';

test('check should return true for valid CPF in strict mode', t => {
  const cpf = '123.456.789-00';
  t.true(check(cpf));
});

test('check should return false for invalid CPF in strict mode', t => {
  const cpf = '123.456.789-0';
  t.false(check(cpf));
});

test('check should return true for partially valid CPF in non-strict mode', t => {
  const cpf1 = '123.45';
  const cpf2 = '123.456.78';
  const cpf3 = '123.456.789-0';
  t.true(check(cpf1, false));
  t.true(check(cpf2, false));
  t.true(check(cpf3, false));
});

test('check should return false for invalid CPF in non-strict mode', t => {
  const cpf1 = '123456.789-0';
  const cpf2 = '123.456.789-000';
  t.false(check(cpf1, false));
  t.false(check(cpf2, false));
});

test('check should return true for CPF with leading/trailing spaces in non-strict mode', t => {
  const cpf = '  123.456.789-00  ';
  t.true(check(cpf, false));
});

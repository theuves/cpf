import test from 'ava';
import { check } from '../check';

test('should return true for valid CPF in strict mode', t => {
  const cpf = '123.456.789-00';
  t.true(check(cpf));
});

test('should return false for invalid CPF in strict mode', t => {
  const cpf = '123.456.789-0';
  t.false(check(cpf));
});

test('should return true for partially valid CPF in non-strict mode', t => {
  const cpf1 = '123.45';
  const cpf2 = '123.456.78';
  const cpf3 = '123.456.789-0';
  t.true(check(cpf1, false));
  t.true(check(cpf2, false));
  t.true(check(cpf3, false));
});

test('should return true for CPF ending with separators in non-strict mode', t => {
  const cpf1 = '123.';
  const cpf2 = '123.456.';
  const cpf3 = '123.456.789-';
  t.true(check(cpf1, false));
  t.true(check(cpf2, false));
  t.true(check(cpf3, false));
});

test('should return false for invalid CPF in non-strict mode', t => {
  const cpf1 = '123456.789-0';
  const cpf2 = '123.456.789-000';
  t.false(check(cpf1, false));
  t.false(check(cpf2, false));
});

test('should return true for CPF with leading/trailing spaces in non-strict mode', t => {
  const cpf = '  123.456.789-00  ';
  t.true(check(cpf, false));
});

test('should return false for CPF with invalid characters in non-strict mode', t => {
  const cpf1 = '123abc456def789ghi00';
  const cpf2 = '123.456.789-0a';
  const cpf3 = '123.456.789-0#';
  t.false(check(cpf1, false));
  t.false(check(cpf2, false));
  t.false(check(cpf3, false));
});

test('should return true for CPF with only valid characters in non-strict mode', t => {
  const cpf1 = '123.456.789-00';
  const cpf2 = '123.456.789-0';
  const cpf3 = '123.456.789';
  t.true(check(cpf1, false));
  t.true(check(cpf2, false));
  t.true(check(cpf3, false));
});

test('should return false if the input is not a string', t => {
  const cpf1 = 12345678900;
  const cpf2 = null;
  const cpf3 = undefined;
  const cpf4 = {};
  const cpf5 = [];
  // @ts-ignore
  t.false(check(cpf1, false));
  // @ts-ignore
  t.false(check(cpf2, false));
  // @ts-ignore
  t.false(check(cpf3, false));
  // @ts-ignore
  t.false(check(cpf4, false));
  // @ts-ignore
  t.false(check(cpf5, false));
});

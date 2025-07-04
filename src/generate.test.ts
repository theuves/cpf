import test from 'ava';
import { generate } from './generate';
import { isValid } from './is-valid';

test('generate should create valid CPF by default', (t) => {
  const cpf = generate();
  t.true(isValid(cpf));
  t.is(cpf.length, 14); // formatted length
});

test('generate should create unformatted CPF when formatted is false', (t) => {
  const cpf = generate(false);
  t.true(isValid(cpf));
  t.is(cpf.length, 11); // unformatted length
});

test('generate should create invalid CPF when invalid is true', (t) => {
  const cpf = generate(true, true);
  t.false(isValid(cpf));
  t.is(cpf.length, 14); // formatted length
});

test('generate should create unformatted invalid CPF', (t) => {
  const cpf = generate(false, true);
  t.false(isValid(cpf));
  t.is(cpf.length, 11); // unformatted length
});

test('generate should create different CPFs on multiple calls', (t) => {
  const cpf1 = generate();
  const cpf2 = generate();
  t.not(cpf1, cpf2);
}); 
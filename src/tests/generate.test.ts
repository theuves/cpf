import test from 'ava';
import generate from '../generate';

test('should generate a single formatted CPF by default', t => {
  const cpf = generate();
  t.is(typeof cpf, 'string');
  t.regex(cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
});

test('should generate multiple formatted CPFs when count is specified', t => {
  const count = 5;
  const cpfs = generate({ count });
  t.true(Array.isArray(cpfs));
  t.is(cpfs.length, count);

  // Using regex instead of the format() function to minimize dependencies.
  cpfs.forEach(cpf => {
    t.regex(cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  });
});

test('should generate unformatted CPF when formatted is false', t => {
  const cpf = generate({ formatted: false });
  t.is(typeof cpf, 'string');
  t.regex(cpf, /^\d{11}$/);
});

test('should generate multiple unformatted CPFs when count is specified', t => {
  const count = 3;
  const cpfs = generate({ count, formatted: false });
  t.true(Array.isArray(cpfs));
  t.is(cpfs.length, count);
  cpfs.forEach(cpf => {
    t.regex(cpf, /^\d{11}$/);
  });
});

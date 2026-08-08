import test from 'ava'
import cpf, { parse as parseCpf } from './cpf/index'
import cnpj, { parse as parseCnpj } from './cnpj/index'

test('should expose the standalone CPF entrypoint', t => {
  t.true(cpf.validate('529.982.247-25'))
  t.deepEqual(parseCpf('529.982.247-25').verifiers, [2, 5])
})

test('should expose the standalone CNPJ entrypoint', t => {
  t.true(cnpj.validate('11.222.333/0001-81'))
  t.deepEqual(parseCnpj('11.222.333/0001-81').verifiers, [8, 1])
})

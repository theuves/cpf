import test from 'ava'
import cpfDefault, {
  cnpj,
  cnpjParse,
  cnpjValidate,
  clear,
  cpf,
  cpfFormat,
  cpfParse,
  cpfValidate,
  getCD,
  isValid,
} from './index'

test('should expose the documented default CPF API', t => {
  t.is(cpfDefault, cpf)
  t.true(cpfDefault.validate('529.982.247-25'))
  t.is(cpfDefault.format('52998224725'), '529.982.247-25')
  t.is(cpfDefault.unformat('529.982.247-25'), '52998224725')
  t.true(cpfDefault.check('529.982.247-25'))
  t.deepEqual(cpfDefault.calc([5, 2, 9, 9, 8, 2, 2, 4, 7]), [2, 5])
  t.true(cpfDefault.validate(cpfDefault.generate()))
  t.deepEqual(cpfDefault.repair('5299822472X'), ['52998224725'])
  t.deepEqual(cpfDefault.rfs('529.982.247-25'), ['ES', 'RJ'])
  t.deepEqual(cpfDefault.parse('529.982.247-25').verifiers, [2, 5])
})

test('should expose the CNPJ namespace', t => {
  t.true(cnpj.validate('11.222.333/0001-81'))
  t.is(cnpj.format('11222333000181'), '11.222.333/0001-81')
  t.is(cnpj.unformat('11.222.333/0001-81'), '11222333000181')
  t.true(cnpj.check('11.222.333/0001-81'))
  t.deepEqual(cnpj.calc([1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0, 1]), [8, 1])
  t.true(cnpj.validate(cnpj.generate()))
  t.deepEqual(cnpj.repair('1122233300018X'), ['11222333000181'])
  t.deepEqual(cnpj.parse('11.222.333/0001-81').verifiers, [8, 1])
})

test('should expose prefixed named functions', t => {
  t.is(cpfFormat, cpf.format)
  t.is(cpfValidate, cpf.validate)
  t.is(cnpjValidate, cnpj.validate)
  t.is(cpfParse, cpf.parse)
  t.is(cnpjParse, cnpj.parse)
})

test('should expose legacy CPF aliases', t => {
  t.is(isValid, cpf.validate)
  t.is(clear, cpf.unformat)
  t.is(getCD, cpf.calc)
  t.true(isValid('529.982.247-25'))
  t.is(clear('529.982.247-25'), '52998224725')
  t.deepEqual(getCD([5, 2, 9, 9, 8, 2, 2, 4, 7]), [2, 5])
})

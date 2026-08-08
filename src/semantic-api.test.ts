import test from 'ava'
import cpf, { cnpj } from './index'

test('exposes only the canonical CPF operations', t => {
  t.deepEqual(Object.keys(cpf).sort(), [
    'calculateCheckDigits',
    'findValidRepairs',
    'format',
    'generate',
    'generateMany',
    'getFiscalRegions',
    'inspect',
    'isValid',
    'matchesFormat',
    'normalize',
    'parse',
  ])
  t.true(cpf.isValid('529.982.247-25'))
  t.true(cpf.inspect('529.982.247-25').valid)
  t.true(cpf.matchesFormat('529.982', { completeness: 'partial' }))
  t.is(cpf.normalize('529.982.247-25'), '52998224725')
  t.deepEqual(cpf.calculateCheckDigits([5, 2, 9, 9, 8, 2, 2, 4, 7]), [2, 5])
  t.deepEqual(cpf.findValidRepairs('5299822472X'), ['52998224725'])
  t.deepEqual(cpf.getFiscalRegions('529.982.247-25'), ['ES', 'RJ'])
  t.deepEqual(cpf.parse('529.982.247-25'), {
    value: '52998224725',
    body: '529982247',
    checkDigits: '25',
    regionDigit: '7',
  })
})

test('keeps generation return types and validity deterministic', t => {
  const cpfValue = cpf.generate({ output: 'plain', randomSource: () => 0 })
  const cnpjValue = cnpj.generate({ output: 'plain', randomSource: () => 0 })
  t.is(typeof cpfValue, 'string')
  t.is(typeof cnpjValue, 'string')
  t.true(cpf.isValid(cpfValue))
  t.true(cnpj.isValid(cnpjValue))
  t.true(cpf.generateMany(2, { output: 'plain' }).every(cpf.isValid))
  t.true(
    cnpj
      .generateMany(2, { kind: 'alphanumeric', output: 'plain' })
      .every(cnpj.isValid)
  )
  t.false(cpf.isValid(cpf.generate({ validity: 'invalid' })))
  t.false(cnpj.isValid(cnpj.generate({ validity: 'invalid' })))
})

test('exposes canonical CNPJ operations and complete semantic parsing', t => {
  t.deepEqual(Object.keys(cnpj).sort(), [
    'calculateCheckDigits',
    'findValidRepairs',
    'format',
    'generate',
    'generateMany',
    'getKind',
    'inspect',
    'isValid',
    'matchesFormat',
    'normalize',
    'parse',
  ])
  t.true(cnpj.matchesFormat('12.ABC', { completeness: 'partial' }))
  t.is(cnpj.getKind('12.ABC.345/01DE-35'), 'alphanumeric')
  t.true(cnpj.inspect('12.ABC.345/01DE-35').valid)
  t.is(cnpj.normalize('12.abc.345/01de-35'), '12ABC34501DE35')
  t.deepEqual(cnpj.calculateCheckDigits('12ABC34501DE'), [3, 5])
  t.deepEqual(cnpj.findValidRepairs('12.ABC.345/01DE-3?'), ['12ABC34501DE35'])
  t.deepEqual(cnpj.parse('12.ABC.345/01DE-35'), {
    value: '12ABC34501DE35',
    root: '12ABC345',
    branch: '01DE',
    checkDigits: '35',
  })
  t.deepEqual(cnpj.parse('12.abc.345/01de-35'), {
    value: '12ABC34501DE35',
    root: '12ABC345',
    branch: '01DE',
    checkDigits: '35',
  })
  t.deepEqual(cpf.parse('5.2.9.9.8.2.2.4.7.2.5'), {
    value: '52998224725',
    body: '529982247',
    checkDigits: '25',
    regionDigit: '7',
  })
  t.false(cpf.matchesFormat('5.2.9.9.8.2.2.4.7.2.5'))
  t.is(cnpj.getKind('1.2.A.B.C.3.4.5.0.1.D.E.3.5'), 'alphanumeric')
  t.false(cnpj.matchesFormat('1.2.A.B.C.3.4.5.0.1.D.E.3.5'))
  t.throws(() => cnpj.parse('12.ABC'), {
    message: 'CNPJ must contain exactly 14 characters',
  })
  t.throws(() => cpf.parse('529.982'), {
    message: 'CPF must contain exactly 11 digits',
  })
})

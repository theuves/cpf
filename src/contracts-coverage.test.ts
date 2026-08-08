import test from 'ava'
import cnpj from './cnpj/index'
import cpf from './cpf/index'
import { cleanCnpj } from './cnpj/codec'
import {
  checkDocument,
  generateDocument,
  repairDocument,
  unformatDocument,
} from './core/document'
import { cpfSpec } from './cpf/spec'

test('covers invalid canonical options and random sources', t => {
  for (const document of [cpf, cnpj]) {
    t.throws(() => document.matchesFormat('x', { completeness: 'x' as never }))
    t.throws(() => document.generate({ validity: 'x' as never }))
    t.throws(() => document.generate({ output: 'x' as never }))
  }
  t.throws(() => cnpj.generate({ kind: 'x' as never }))
  for (const sample of [-1, 1, Number.NaN]) {
    t.throws(() => cpf.generate({ randomSource: () => sample }))
    t.throws(() => cnpj.generate({ randomSource: () => sample }))
  }
  t.throws(() => cpf.generateMany(0))
  t.throws(() => cnpj.generateMany(0))
})

test('covers normalization, repair and shared-core rejection paths', t => {
  // @ts-expect-error runtime guard
  t.throws(() => cnpj.normalize(1))
  t.throws(() => cnpj.normalize('12ABC34501DE35!'))
  t.throws(() => cnpj.normalize('12ABC34501DE355'))
  t.throws(() => cleanCnpj('12ABC34501DE355', true))
  t.is(cleanCnpj('12abc34501de35', false), '12ABC34501DE35')
  t.throws(() => cleanCnpj('12ABC34501DE3A', true))
  t.throws(() => unformatDocument(cpfSpec, 1, true))
  t.is(unformatDocument(cpfSpec, '123456789012', false), '12345678901')
  t.false(checkDocument(cpfSpec, 1, true))
  t.false(checkDocument(cpfSpec, '123', true))
  t.false(checkDocument(cpfSpec, 'abc', false))
  t.true(checkDocument(cpfSpec, '123', false))
  t.deepEqual(repairDocument(cpfSpec, 'X2345678X01'), [])
  t.deepEqual(repairDocument(cpfSpec, null), [])
  t.deepEqual(repairDocument(cpfSpec, '123'), [])
  t.deepEqual(repairDocument(cpfSpec, '52998224725'), ['52998224725'])
  t.deepEqual(repairDocument(cpfSpec, '52998224726'), [])
  t.deepEqual(repairDocument(cpfSpec, '52998224XXX'), [])
  t.deepEqual(repairDocument(cpfSpec, '529982247XX'), ['52998224725'])
  t.deepEqual(repairDocument(cpfSpec, '000000000XX'), [])
  t.throws(() =>
    generateDocument(cpfSpec, { isFormatted: false, isValid: true }, () => 1)
  )
  t.is(
    typeof generateDocument(cpfSpec, { isFormatted: false, isValid: true }),
    'string'
  )

  t.deepEqual(cnpj.findValidRepairs(null as never), [])
  t.throws(() => cnpj.findValidRepairs('12ABC34501DE35', { placeholder: 'X' }))
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE3'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE???'), [])
  t.deepEqual(cnpj.findValidRepairs('?2ABC34501DE3?'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE35'), ['12ABC34501DE35'])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE36'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501D???'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE??'), ['12ABC34501DE35'])
  t.deepEqual(cnpj.findValidRepairs('000000000000??'), [])
  t.true(cnpj.findValidRepairs('?2ABC34501DE35').includes('12ABC34501DE35'))
  t.true(cnpj.findValidRepairs('?1222333000181').length > 0)
  t.true(
    cnpj
      .findValidRepairs('?2ABC34501DE35', { kind: 'numeric' })
      .includes('12ABC34501DE35')
  )
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE3_', { placeholder: '_' }), [
    '12ABC34501DE35',
  ])
  t.true(
    cnpj.findValidRepairs('$2ABC34501DE35', { placeholder: '$' }).length > 0
  )
  t.true(cnpj.matchesFormat('12.ABC.345/01DE-35'))
  t.false(cnpj.matchesFormat(null as never))
  t.false(cnpj.matchesFormat('12.ABC', { completeness: 'complete' }))
  t.false(cnpj.matchesFormat('abc', { completeness: 'partial' }))
  t.true(cnpj.matchesFormat('12.ABC', { completeness: 'partial' }))
  t.is(
    cnpj
      .generate({
        kind: 'alphanumeric',
        output: 'plain',
        randomSource: () => 0,
      })
      .slice(11, 12),
    'A'
  )
})

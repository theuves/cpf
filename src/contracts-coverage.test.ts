import test from 'ava'
import cnpj from './cnpj/index'
import cpf from './cpf/index'
import { cleanCnpj } from './cnpj/codec'
import {
  checkDocument,
  generateDocument,
  MAX_GENERATION_BATCH_SIZE,
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
  t.throws(() =>
    cnpj.findValidRepairs('12ABC34501DE3?', { kind: 'x' as never })
  )
  for (const sample of [-1, 1, Number.NaN]) {
    t.throws(() => cpf.generate({ randomSource: () => sample }))
    t.throws(() => cnpj.generate({ randomSource: () => sample }))
  }
  t.throws(() => cpf.generateMany(0))
  t.throws(() => cnpj.generateMany(0))
  for (const document of [cpf, cnpj]) {
    t.throws(() => document.generateMany(1.5), {
      message: 'Count must be a positive integer',
    })
    t.throws(() => document.generateMany(MAX_GENERATION_BATCH_SIZE + 1), {
      message: `Count cannot exceed ${MAX_GENERATION_BATCH_SIZE}`,
    })
  }

  for (const invalidNumber of [-1, 1.2, Number.NaN, Number.POSITIVE_INFINITY]) {
    t.throws(() => cpf.format(invalidNumber, { strict: false }), {
      message: 'Number input must be a non-negative safe integer',
    })
    t.throws(() => cnpj.format(invalidNumber, { strict: false }), {
      message: 'Number input must be a non-negative safe integer',
    })
  }
  t.throws(() => cpf.format(Number.MAX_SAFE_INTEGER + 1, { strict: false }))
  t.throws(() => cnpj.format(Number.MAX_SAFE_INTEGER + 1, { strict: false }))
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
  t.deepEqual(cnpj.findValidRepairs('1'.repeat(1_000_000)), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE???'), [])
  t.deepEqual(cnpj.findValidRepairs('?2ABC34501DE3?'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE35'), ['12ABC34501DE35'])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE36'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501D???'), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE??'), ['12ABC34501DE35'])
  t.deepEqual(cnpj.findValidRepairs('000000000000??'), [])
  t.true(cnpj.findValidRepairs('?2ABC34501DE35').includes('12ABC34501DE35'))
  t.true(cnpj.findValidRepairs('?1222333000181').length > 0)
  t.deepEqual(
    cnpj.findValidRepairs('?1222333000181', { kind: 'alphanumeric' }),
    ['G1222333000181', 'R1222333000181']
  )
  t.deepEqual(cnpj.findValidRepairs('?2ABC34501DE35', { kind: 'numeric' }), [])
  t.deepEqual(cnpj.findValidRepairs('12ABC34501DE3?', { kind: 'numeric' }), [])
  t.deepEqual(
    cnpj.findValidRepairs('11222333000181', { kind: 'alphanumeric' }),
    []
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
  for (const partial of ['', '1']) {
    t.true(cnpj.matchesFormat(partial, { completeness: 'partial' }))
  }
  for (const partial of ['', '1', '12']) {
    t.true(cpf.matchesFormat(partial, { completeness: 'partial' }))
  }
  t.deepEqual(cpf.findValidRepairs('529!982!247!2X'), [])
  t.deepEqual(cpf.findValidRepairs('529.982.247-25!'), [])
  t.deepEqual(cpf.findValidRepairs('1'.repeat(1_000_000)), [])
  t.deepEqual(cnpj.findValidRepairs('12!ABC!345!01DE!3?'), [])
  t.deepEqual(cnpj.findValidRepairs('12.ABC.345/01DE-35!'), [])
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

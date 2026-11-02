import { strict as assert } from 'node:assert'
import { test } from 'node:test'
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

test('covers invalid canonical options and random sources', () => {
  for (const document of [cpf, cnpj]) {
    assert.throws(() =>
      document.matchesFormat('x', { completeness: 'x' as never })
    )
    assert.throws(() => document.generate({ validity: 'x' as never }))
    assert.throws(() => document.generate({ output: 'x' as never }))
  }
  assert.throws(() => cnpj.generate({ kind: 'x' as never }))
  assert.throws(() =>
    cnpj.findValidRepairs('12ABC34501DE3?', { kind: 'x' as never })
  )
  for (const sample of [-1, 1, Number.NaN]) {
    assert.throws(() => cpf.generate({ randomSource: () => sample }))
    assert.throws(() => cnpj.generate({ randomSource: () => sample }))
  }
  assert.throws(() => cpf.generateMany(0))
  assert.throws(() => cnpj.generateMany(0))
  for (const document of [cpf, cnpj]) {
    assert.throws(() => document.generateMany(1.5), {
      message: 'Count must be a positive integer',
    })
    assert.throws(() => document.generateMany(MAX_GENERATION_BATCH_SIZE + 1), {
      message: `Count cannot exceed ${MAX_GENERATION_BATCH_SIZE}`,
    })
  }

  for (const invalidNumber of [-1, 1.2, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => cpf.format(invalidNumber, { strict: false }), {
      message: 'Number input must be a non-negative safe integer',
    })
    assert.throws(() => cnpj.format(invalidNumber, { strict: false }), {
      message: 'Number input must be a non-negative safe integer',
    })
  }
  assert.throws(() =>
    cpf.format(Number.MAX_SAFE_INTEGER + 1, { strict: false })
  )
  assert.throws(() =>
    cnpj.format(Number.MAX_SAFE_INTEGER + 1, { strict: false })
  )
})

test('covers normalization, repair and shared-core rejection paths', () => {
  // @ts-expect-error runtime guard
  assert.throws(() => cnpj.normalize(1))
  assert.throws(() => cnpj.normalize('12ABC34501DE35!'))
  assert.throws(() => cnpj.normalize('12ABC34501DE355'))
  assert.throws(() => cleanCnpj('12ABC34501DE355', true))
  assert.strictEqual(cleanCnpj('12abc34501de35', false), '12ABC34501DE35')
  assert.throws(() => cleanCnpj('12ABC34501DE3A', true))
  assert.throws(() => unformatDocument(cpfSpec, 1, true))
  assert.strictEqual(
    unformatDocument(cpfSpec, '123456789012', false),
    '12345678901'
  )
  assert.strictEqual(checkDocument(cpfSpec, 1, true), false)
  assert.strictEqual(checkDocument(cpfSpec, '123', true), false)
  assert.strictEqual(checkDocument(cpfSpec, 'abc', false), false)
  assert.strictEqual(checkDocument(cpfSpec, '123', false), true)
  assert.deepStrictEqual(repairDocument(cpfSpec, 'X2345678X01'), [])
  assert.deepStrictEqual(repairDocument(cpfSpec, null), [])
  assert.deepStrictEqual(repairDocument(cpfSpec, '123'), [])
  assert.deepStrictEqual(repairDocument(cpfSpec, '52998224725'), [
    '52998224725',
  ])
  assert.deepStrictEqual(repairDocument(cpfSpec, '52998224726'), [])
  assert.deepStrictEqual(repairDocument(cpfSpec, '52998224XXX'), [])
  assert.deepStrictEqual(repairDocument(cpfSpec, '529982247XX'), [
    '52998224725',
  ])
  assert.deepStrictEqual(repairDocument(cpfSpec, '000000000XX'), [])
  assert.throws(() =>
    generateDocument(cpfSpec, { isFormatted: false, isValid: true }, () => 1)
  )
  assert.strictEqual(
    typeof generateDocument(cpfSpec, { isFormatted: false, isValid: true }),
    'string'
  )

  assert.deepStrictEqual(cnpj.findValidRepairs(null as never), [])
  assert.throws(() =>
    cnpj.findValidRepairs('12ABC34501DE35', { placeholder: 'X' })
  )
  assert.deepStrictEqual(cnpj.findValidRepairs('12ABC34501DE3'), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('1'.repeat(1_000_000)), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('12ABC34501DE???'), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('?2ABC34501DE3?'), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('12ABC34501DE35'), [
    '12ABC34501DE35',
  ])
  assert.deepStrictEqual(cnpj.findValidRepairs('12ABC34501DE36'), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('12ABC34501D???'), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('12ABC34501DE??'), [
    '12ABC34501DE35',
  ])
  assert.deepStrictEqual(cnpj.findValidRepairs('000000000000??'), [])
  assert.strictEqual(
    cnpj.findValidRepairs('?2ABC34501DE35').includes('12ABC34501DE35'),
    true
  )
  assert.strictEqual(cnpj.findValidRepairs('?1222333000181').length > 0, true)
  assert.deepStrictEqual(
    cnpj.findValidRepairs('?1222333000181', { kind: 'alphanumeric' }),
    ['G1222333000181', 'R1222333000181']
  )
  assert.deepStrictEqual(
    cnpj.findValidRepairs('?2ABC34501DE35', { kind: 'numeric' }),
    []
  )
  assert.deepStrictEqual(
    cnpj.findValidRepairs('12ABC34501DE3?', { kind: 'numeric' }),
    []
  )
  assert.deepStrictEqual(
    cnpj.findValidRepairs('11222333000181', { kind: 'alphanumeric' }),
    []
  )
  assert.deepStrictEqual(
    cnpj.findValidRepairs('12ABC34501DE3_', { placeholder: '_' }),
    ['12ABC34501DE35']
  )
  assert.strictEqual(
    cnpj.findValidRepairs('$2ABC34501DE35', { placeholder: '$' }).length > 0,
    true
  )
  assert.strictEqual(cnpj.matchesFormat('12.ABC.345/01DE-35'), true)
  assert.strictEqual(cnpj.matchesFormat(null as never), false)
  assert.strictEqual(
    cnpj.matchesFormat('12.ABC', { completeness: 'complete' }),
    false
  )
  assert.strictEqual(
    cnpj.matchesFormat('abc', { completeness: 'partial' }),
    false
  )
  assert.strictEqual(
    cnpj.matchesFormat('12.ABC', { completeness: 'partial' }),
    true
  )
  for (const partial of ['', '1']) {
    assert.strictEqual(
      cnpj.matchesFormat(partial, { completeness: 'partial' }),
      true
    )
  }
  for (const partial of ['', '1', '12']) {
    assert.strictEqual(
      cpf.matchesFormat(partial, { completeness: 'partial' }),
      true
    )
  }
  assert.deepStrictEqual(cpf.findValidRepairs('529!982!247!2X'), [])
  assert.deepStrictEqual(cpf.findValidRepairs('529.982.247-25!'), [])
  assert.deepStrictEqual(cpf.findValidRepairs('1'.repeat(1_000_000)), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('12!ABC!345!01DE!3?'), [])
  assert.deepStrictEqual(cnpj.findValidRepairs('12.ABC.345/01DE-35!'), [])
  assert.strictEqual(
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

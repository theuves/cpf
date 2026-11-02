import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { numericCnpjSpec } from '../cnpj/spec'
import { cpfSpec } from '../cpf/spec'
import {
  formatDocument,
  generateDocument,
  repairDocument,
  unformatDocument,
  validateDocument,
} from './document'
import type { DocumentSpec } from './types'

const specs = [cpfSpec, numericCnpjSpec] as const

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 0x1_0000_0000
  }
}

function generateMany(
  spec: DocumentSpec,
  seed: number,
  isValid: boolean
): string[] {
  const random = seededRandom(seed)
  return Array.from({ length: 200 }, () =>
    generateDocument(spec, { isFormatted: false, isValid }, random)
  )
}

for (const spec of specs) {
  test(`${spec.name}: seeded generation is reproducible`, () => {
    const first = generateMany(spec, 42, true)
    const second = generateMany(spec, 42, true)
    const differentSeed = generateMany(spec, 43, true)

    assert.deepStrictEqual(first, second)
    assert.notDeepStrictEqual(first, differentSeed)
    assert.strictEqual(new Set(first).size > 1, true)
  })

  test(`${spec.name}: generated validity matches the requested property`, () => {
    for (const document of generateMany(spec, 1, true)) {
      assert.strictEqual(validateDocument(spec, document), true)
    }
    for (const document of generateMany(spec, 2, false)) {
      assert.strictEqual(validateDocument(spec, document), false)
    }
  })

  test(`${spec.name}: formatting round-trips generated digit strings`, () => {
    for (const digits of generateMany(spec, 3, true)) {
      const formatted = formatDocument(spec, digits, true)
      assert.strictEqual(unformatDocument(spec, formatted, true), digits)
      assert.strictEqual(formatDocument(spec, formatted, true), formatted)
    }
  })

  test(`${spec.name}: changing either verifier invalidates a generated document`, () => {
    for (const digits of generateMany(spec, 4, true)) {
      for (
        let position = spec.bodyLength;
        position < spec.totalLength;
        position++
      ) {
        const replacement = ((Number(digits[position]) + 1) % 10).toString()
        const changed =
          digits.slice(0, position) + replacement + digits.slice(position + 1)
        assert.strictEqual(validateDocument(spec, changed), false)
      }
    }
  })

  test(`${spec.name}: repairing any single unknown digit only returns valid results`, () => {
    for (const digits of generateMany(spec, 5, true).slice(0, 20)) {
      for (let position = 0; position < spec.totalLength; position++) {
        const unknown =
          digits.slice(0, position) + 'X' + digits.slice(position + 1)
        const repaired = repairDocument(spec, unknown)
        assert.strictEqual(repaired.includes(digits), true)
        assert.strictEqual(
          repaired.every(candidate => validateDocument(spec, candidate)),
          true
        )
      }
    }
  })

  test(`${spec.name}: repeated random digits are corrected deterministically`, () => {
    const generated = generateDocument(
      spec,
      { isFormatted: false, isValid: true },
      () => 0
    )

    assert.strictEqual(typeof generated, 'string')
    if (typeof generated !== 'string') return
    assert.strictEqual(
      generated.slice(0, spec.bodyLength),
      `${'0'.repeat(spec.bodyLength - 1)}1`
    )
    assert.strictEqual(validateDocument(spec, generated), true)
  })

  test(`${spec.name}: repeated bodies cannot be repaired with two verifiers`, () => {
    const unknownVerifiers = `${'0'.repeat(spec.bodyLength)}XX`
    assert.deepStrictEqual(repairDocument(spec, unknownVerifiers), [])
    const unknownSecondVerifier = `${'0'.repeat(spec.bodyLength)}0X`
    assert.deepStrictEqual(repairDocument(spec, unknownSecondVerifier), [])
  })

  test(`${spec.name}: generation uses its default random source`, () => {
    const generated = generateDocument(spec, {
      isFormatted: false,
      isValid: true,
    })
    assert.strictEqual(typeof generated, 'string')
  })
}

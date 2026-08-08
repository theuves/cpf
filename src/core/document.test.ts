import test from 'ava'
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
  return Array.from({ length: 200 }, () =>
    generateDocument(spec, { isFormatted: false, isValid }, seededRandom(seed))
  )
}

for (const spec of specs) {
  test(`${spec.name}: seeded generation is reproducible`, t => {
    const first = generateMany(spec, 42, true)
    const second = generateMany(spec, 42, true)
    const differentSeed = generateMany(spec, 43, true)

    t.deepEqual(first, second)
    t.notDeepEqual(first, differentSeed)
  })

  test(`${spec.name}: generated validity matches the requested property`, t => {
    for (const document of generateMany(spec, 1, true)) {
      t.true(validateDocument(spec, document))
    }
    for (const document of generateMany(spec, 2, false)) {
      t.false(validateDocument(spec, document))
    }
  })

  test(`${spec.name}: formatting round-trips generated digit strings`, t => {
    for (const digits of generateMany(spec, 3, true)) {
      const formatted = formatDocument(spec, digits, true)
      t.is(unformatDocument(spec, formatted, true), digits)
      t.is(formatDocument(spec, formatted, true), formatted)
    }
  })

  test(`${spec.name}: changing either verifier invalidates a generated document`, t => {
    for (const digits of generateMany(spec, 4, true)) {
      for (
        let position = spec.bodyLength;
        position < spec.totalLength;
        position++
      ) {
        const replacement = ((Number(digits[position]) + 1) % 10).toString()
        const changed =
          digits.slice(0, position) + replacement + digits.slice(position + 1)
        t.false(validateDocument(spec, changed))
      }
    }
  })

  test(`${spec.name}: repairing any single unknown digit only returns valid results`, t => {
    for (const digits of generateMany(spec, 5, true).slice(0, 20)) {
      for (let position = 0; position < spec.totalLength; position++) {
        const unknown =
          digits.slice(0, position) + 'X' + digits.slice(position + 1)
        const repaired = repairDocument(spec, unknown)
        t.true(repaired.includes(digits))
        t.true(repaired.every(candidate => validateDocument(spec, candidate)))
      }
    }
  })

  test(`${spec.name}: repeated random digits are corrected deterministically`, t => {
    const generated = generateDocument(
      spec,
      { isFormatted: false, isValid: true },
      () => 0
    )

    t.is(typeof generated, 'string')
    if (typeof generated !== 'string') return
    t.is(
      generated.slice(0, spec.bodyLength),
      `${'0'.repeat(spec.bodyLength - 1)}1`
    )
    t.true(validateDocument(spec, generated))
  })

  test(`${spec.name}: repeated bodies cannot be repaired with two verifiers`, t => {
    const unknownVerifiers = `${'0'.repeat(spec.bodyLength)}XX`
    t.deepEqual(repairDocument(spec, unknownVerifiers), [])
    const unknownSecondVerifier = `${'0'.repeat(spec.bodyLength)}0X`
    t.deepEqual(repairDocument(spec, unknownSecondVerifier), [])
  })

  test(`${spec.name}: generation uses its default random source`, t => {
    const generated = generateDocument(spec, {
      isFormatted: false,
      isValid: true,
    })
    t.is(typeof generated, 'string')
  })
}

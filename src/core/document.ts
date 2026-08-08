/* c8 ignore next */
import type {
  DocumentSpec,
  GenerateDocumentOptions,
  ParsedDocument,
} from './types'

export function calculateVerifiers(
  spec: DocumentSpec,
  body: readonly number[]
): [number, number] {
  if (body.length !== spec.bodyLength) {
    throw new Error(`Input must be exactly ${spec.bodyLength} digits`)
  }
  if (
    !body.every(digit => Number.isInteger(digit) && digit >= 0 && digit <= 9)
  ) {
    throw new Error('All elements must be integers between 0 and 9')
  }

  const first = calculateVerifier(body, spec.weights[0])
  const second = calculateVerifier([...body, first], spec.weights[1])
  return [first, second]
}

function calculateVerifier(
  digits: readonly number[],
  weights: readonly number[]
): number {
  const sum = digits.reduce(
    (total, digit, index) => total + digit * (weights[index] as number),
    0
  )
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function checkDocument(
  spec: DocumentSpec,
  input: unknown,
  strict: boolean
): boolean {
  if (typeof input !== 'string') return false
  if (strict) return spec.strictPattern.test(input)

  const trimmed = input.trim()
  if (!spec.validCharsPattern.test(trimmed)) return false
  return spec.partialPatterns.some(pattern => pattern.test(trimmed))
}

export function formatDocument(
  spec: DocumentSpec,
  input: string | number,
  strict: boolean
): string {
  let value: unknown = input
  if (typeof value === 'number') {
    if (strict) {
      throw new Error('Number input is only allowed when strict=false')
    }
    value = value.toString().padStart(spec.totalLength, '0')
  }
  if (typeof value !== 'string') {
    throw new Error('Input must be a string or number')
  }

  let digits = value.replace(/\D/g, '')
  if (strict) {
    assertValidCharacters(spec, value)
    assertMaximumLength(spec, digits)
  } else {
    digits = digits.slice(0, spec.totalLength)
  }
  return formatDigits(spec, digits)
}

export function unformatDocument(
  spec: DocumentSpec,
  input: unknown,
  strict: boolean
): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string')
  }

  let digits = input.replace(/\D/g, '')
  if (strict) {
    assertValidCharacters(spec, input)
    assertMaximumLength(spec, digits)
  } else {
    digits = digits.slice(0, spec.totalLength)
  }
  return digits
}

function assertValidCharacters(spec: DocumentSpec, input: string): void {
  if (!spec.validCharsPattern.test(input)) {
    throw new Error(`Invalid characters in ${spec.name} input`)
  }
}

function assertMaximumLength(spec: DocumentSpec, digits: string): void {
  if (digits.length > spec.totalLength) {
    throw new Error(
      `${spec.name} cannot have more than ${spec.totalLength} digits`
    )
  }
}

function formatDigits(spec: DocumentSpec, digits: string): string {
  let result = ''
  let offset = 0

  for (const segment of spec.formatSegments) {
    if (offset >= digits.length) break
    if (offset > 0 && segment.separator) result += segment.separator
    result += digits.slice(offset, offset + segment.length)
    offset += segment.length
  }
  return result
}

export function parseDocument(
  spec: DocumentSpec,
  input: string,
  bodyPartLengths: readonly number[]
): ParsedDocument {
  const digits = input
    .replace(/\D/g, '')
    .slice(0, spec.totalLength)
    .split('')
    .map(Number)
  const fullBody = digits.slice(0, Math.min(spec.bodyLength, digits.length))
  const bodyParts: number[][] = []
  let offset = 0

  for (const length of bodyPartLengths) {
    bodyParts.push(fullBody.slice(offset, offset + length))
    offset += length
  }

  return {
    digits,
    fullBody,
    bodyParts,
    verifiers: digits.slice(spec.bodyLength),
  }
}

export function validateDocument(spec: DocumentSpec, input: unknown): boolean {
  if (typeof input !== 'string' || !spec.validCharsPattern.test(input)) {
    return false
  }

  const digits = input.replace(/\D/g, '')
  if (digits.length !== spec.totalLength) return false
  if ([...digits].every(digit => digit === digits[0])) return false

  const body = [...digits.slice(0, spec.bodyLength)].map(Number)
  const actual = [...digits.slice(spec.bodyLength)].map(Number)
  const expected = calculateVerifiers(spec, body)
  return expected[0] === actual[0] && expected[1] === actual[1]
}

export function repairDocument(spec: DocumentSpec, input: unknown): string[] {
  if (typeof input !== 'string') return []

  const clean = input.replace(/[^0-9X]/g, '')
  if (clean.length !== spec.totalLength) return []

  const positions = [...clean.matchAll(/X/g)].map(match => match.index)
  if (positions.length === 0)
    return validateDocument(spec, clean) ? [clean] : []
  if (positions.length > 2) return []

  const firstVerifierPosition = spec.bodyLength
  const secondVerifierPosition = spec.bodyLength + 1
  if (
    positions.length === 2 &&
    !(
      positions[0] === firstVerifierPosition &&
      positions[1] === secondVerifierPosition
    )
  ) {
    return []
  }

  if (positions.length === 2) {
    return replaceVerifiers(spec, clean)
  }

  const position = positions[0]
  if (
    position === firstVerifierPosition ||
    position === secondVerifierPosition
  ) {
    return replaceKnownVerifier(spec, clean, position)
  }

  const repaired: string[] = []
  for (let digit = 0; digit <= 9; digit++) {
    const candidate = clean.replace('X', digit.toString())
    if (validateDocument(spec, candidate)) repaired.push(candidate)
  }
  return repaired
}

function replaceKnownVerifier(
  spec: DocumentSpec,
  input: string,
  position: number
): string[] {
  const body = [...input.slice(0, spec.bodyLength)].map(Number)
  const verifiers = calculateVerifiers(spec, body)
  const verifier = position === spec.bodyLength ? verifiers[0] : verifiers[1]
  const result = input.replace('X', verifier.toString())
  return validateDocument(spec, result) ? [result] : []
}

function replaceVerifiers(spec: DocumentSpec, input: string): string[] {
  const body = [...input.slice(0, spec.bodyLength)].map(Number)
  const [first, second] = calculateVerifiers(spec, body)
  const result = input
    .replace('X', first.toString())
    .replace('X', second.toString())
  return validateDocument(spec, result) ? [result] : []
}

/* c8 ignore next */
export function generateDocument(
  spec: DocumentSpec,
  options: GenerateDocumentOptions,
  random: () => number = Math.random
): string | string[] {
  const { valid, count, formatted } = options
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Count must be a positive integer')
  }

  const generateSingle = (): string => {
    const body = Array.from({ length: spec.bodyLength }, () =>
      Math.floor(random() * 10)
    )
    if (body.every(digit => digit === body[0])) {
      body[spec.bodyLength - 1] = ((body[0] as number) + 1) % 10
    }

    const [first, second] = calculateVerifiers(spec, body)
    const last = valid ? second : (second + 1) % 10
    const digits = `${body.join('')}${first}${last}`
    return formatted ? formatDocument(spec, digits, true) : digits
  }

  if (count === 1) return generateSingle()
  return Array.from({ length: count }, generateSingle)
}

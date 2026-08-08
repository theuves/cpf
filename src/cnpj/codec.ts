/* c8 ignore next */
import { numericCnpjSpec } from './spec'

export type CnpjKind = 'numeric' | 'alphanumeric'
export type CnpjCharacter = number | string
export type CnpjBody = string | readonly CnpjCharacter[]

const ALPHANUMERIC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMERIC = '0123456789'
const STRICT_INPUT_PATTERN = /^[A-Z0-9.\-/\s]+$/

export function hasValidCnpjCharacters(input: string): boolean {
  return input === '' || STRICT_INPUT_PATTERN.test(input)
}

export function calculateCnpjVerifiers(body: CnpjBody): [number, number] {
  const characters = normalizeBody(body)
  const first = calculateVerifier(characters, numericCnpjSpec.weights[0])
  const second = calculateVerifier(
    [...characters, first.toString()],
    numericCnpjSpec.weights[1]
  )
  return [first, second]
}

export function cleanCnpj(input: string, strict: boolean): string {
  if (strict && input !== '' && !STRICT_INPUT_PATTERN.test(input)) {
    throw new Error('Invalid characters in CNPJ input')
  }

  const source = strict ? input : input.toUpperCase()
  const characters = source.replace(/[^A-Z0-9]/g, '')
  if (strict && characters.length > numericCnpjSpec.totalLength) {
    throw new Error(
      `CNPJ cannot have more than ${numericCnpjSpec.totalLength} characters`
    )
  }
  if (strict && /[A-Z]/.test(characters.slice(12))) {
    throw new Error('CNPJ verifier positions must contain digits')
  }
  return strict ? characters : characters.slice(0, numericCnpjSpec.totalLength)
}

export function formatCnpjCharacters(characters: string): string {
  let result = ''
  let offset = 0

  for (const segment of numericCnpjSpec.formatSegments) {
    if (offset >= characters.length) break
    if (offset > 0 && segment.separator) result += segment.separator
    result += characters.slice(offset, offset + segment.length)
    offset += segment.length
  }
  return result
}

export function isStructurallyValidCnpj(input: unknown): input is string {
  if (typeof input !== 'string' || !STRICT_INPUT_PATTERN.test(input)) {
    return false
  }
  const characters = input.replace(/[^A-Z0-9]/g, '')
  return /^[A-Z0-9]{12}\d{2}$/.test(characters)
}

export function getCnpjAlphabet(kind: CnpjKind): string {
  return kind === 'numeric' ? NUMERIC : ALPHANUMERIC
}

function normalizeBody(body: CnpjBody): string[] {
  const characters =
    typeof body === 'string'
      ? body.replace(/[.\-/\s]/g, '').split('')
      : body.map(character =>
          typeof character === 'number' ? character.toString() : character
        )

  if (characters.length !== numericCnpjSpec.bodyLength) {
    throw new Error(
      `Input must be exactly ${numericCnpjSpec.bodyLength} characters`
    )
  }
  if (!characters.every(character => /^[A-Z0-9]$/.test(character))) {
    throw new Error(
      'All elements must be digits or uppercase letters from A to Z'
    )
  }
  return characters
}

/* c8 ignore next */
function calculateVerifier(
  characters: readonly string[],
  weights: readonly number[]
): number {
  const sum = characters.reduce(
    (total, character, index) =>
      total + (character.charCodeAt(0) - 48) * (weights[index] as number),
    0
  )
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

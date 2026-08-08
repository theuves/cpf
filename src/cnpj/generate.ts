/* c8 ignore next */
import {
  calculateCnpjVerifiers,
  formatCnpjCharacters,
  getCnpjAlphabet,
} from './codec'
import { assertGenerationCount } from '../core/document'
import type { CnpjKind } from './codec'

export type GenerationValidity = 'valid' | 'invalid'
export type GenerationOutput = 'formatted' | 'plain'

export interface GenerationOptions {
  validity?: GenerationValidity
  output?: GenerationOutput
  kind?: CnpjKind
  randomSource?: () => number
}

export default function generate(options: GenerationOptions = {}): string {
  const resolved = resolveGenerationOptions(options)
  return generateSingle(resolved)
}

/* c8 ignore next */
export function generateMany(
  count: number,
  options: GenerationOptions = {}
): string[] {
  assertGenerationCount(count)
  const resolved = resolveGenerationOptions(options)
  return Array.from({ length: count }, () => generateSingle(resolved))
}

/* c8 ignore next */
function generateSingle(options: {
  valid: boolean
  formatted: boolean
  kind: CnpjKind
  random: () => number
}): string {
  const alphabet = getCnpjAlphabet(options.kind)
  const body = Array.from({ length: 12 }, () => {
    const sample = options.random()
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new Error('Random source must return a number from 0 up to 1')
    }
    return alphabet.charAt(Math.floor(sample * alphabet.length))
  })

  if (
    options.kind === 'numeric' &&
    body.every(character => character === body[0])
  ) {
    body[11] = ((Number(body[0]) + 1) % 10).toString()
  }
  if (
    options.kind === 'alphanumeric' &&
    body.every(character => /\d/.test(character))
  ) {
    body[11] = 'A'
  }

  const [first, second] = calculateCnpjVerifiers(body)
  const last = options.valid ? second : (second + 1) % 10
  const cnpj = `${body.join('')}${first}${last}`
  return options.formatted ? formatCnpjCharacters(cnpj) : cnpj
}

/* c8 ignore next */
function resolveGenerationOptions(options: GenerationOptions): {
  valid: boolean
  formatted: boolean
  kind: CnpjKind
  random: () => number
} {
  if (
    options.validity !== undefined &&
    options.validity !== 'valid' &&
    options.validity !== 'invalid'
  ) {
    throw new Error('Validity must be valid or invalid')
  }
  if (
    options.output !== undefined &&
    options.output !== 'formatted' &&
    options.output !== 'plain'
  ) {
    throw new Error('Output must be formatted or plain')
  }
  const kind = options.kind ?? 'numeric'
  if (kind !== 'numeric' && kind !== 'alphanumeric') {
    throw new Error('Kind must be numeric or alphanumeric')
  }

  return {
    valid: options.validity !== 'invalid',
    formatted: options.output !== 'plain',
    kind,
    random: options.randomSource ?? Math.random,
  }
}

/* c8 ignore next */
import {
  calculateCnpjVerifiers,
  formatCnpjCharacters,
  getCnpjAlphabet,
} from './codec'
import type { CnpjMode } from './codec'

export interface GenerateOptions {
  valid?: boolean
  count?: number
  formatted?: boolean
  mode?: CnpjMode
  random?: () => number
}

export type GenerateResult<Count extends number> = number extends Count
  ? string | string[]
  : Count extends 1
    ? string
    : string[]

export default function generate(
  options?: GenerateOptions & { count?: 1 }
): string
export default function generate<const Count extends number>(
  options: GenerateOptions & { count: Count }
): GenerateResult<Count>
export default function generate(
  options: GenerateOptions = {}
): string | string[] {
  const {
    valid = true,
    count = 1,
    formatted = true,
    mode = 'numeric',
    random = Math.random,
  } = options
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Count must be a positive integer')
  }
  if (mode !== 'numeric' && mode !== 'alphanumeric') {
    throw new Error('Mode must be numeric or alphanumeric')
  }

  const alphabet = getCnpjAlphabet(mode)
  const generateSingle = (): string => {
    const body = Array.from({ length: 12 }, () => {
      const sample = random()
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
        throw new Error('Random source must return a number from 0 up to 1')
      }
      return alphabet[Math.floor(sample * alphabet.length)] as string
    })

    if (mode === 'numeric' && body.every(character => character === body[0])) {
      body[11] = ((Number(body[0]) + 1) % 10).toString()
    }
    if (
      mode === 'alphanumeric' &&
      body.every(character => /\d/.test(character))
    ) {
      body[11] = 'A'
    }

    const [first, second] = calculateCnpjVerifiers(body)
    const last = valid ? second : (second + 1) % 10
    const cnpj = `${body.join('')}${first}${last}`
    return formatted ? formatCnpjCharacters(cnpj) : cnpj
  }

  if (count === 1) return generateSingle()
  return Array.from({ length: count }, generateSingle)
}

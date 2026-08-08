/* c8 ignore next */
import { generateDocument } from '../core/document'
import { cpfSpec } from './spec'

export interface GenerateOptions {
  validity?: GenerationValidity
  output?: GenerationOutput
  randomSource?: () => number
}

export type GenerationValidity = 'valid' | 'invalid'
export type GenerationOutput = 'formatted' | 'plain'

export interface GenerationOptions {
  validity?: GenerationValidity
  output?: GenerationOutput
  randomSource?: () => number
}

export default function generate(options: GenerateOptions = {}): string {
  const { isValid, isFormatted, random } = resolveGenerationOptions(options)
  return generateDocument(cpfSpec, { isValid, isFormatted }, random) as string
}

/* c8 ignore next */
export function generateMany(
  count: number,
  options: GenerationOptions = {}
): string[] {
  const { isValid, isFormatted, random } = resolveGenerationOptions(options)
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Count must be a positive integer')
  }
  return Array.from({ length: count }, () =>
    generateDocument(cpfSpec, { isValid, isFormatted }, random)
  )
}

/* c8 ignore next */
function resolveGenerationOptions(options: GenerateOptions): {
  isValid: boolean
  isFormatted: boolean
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

  return {
    isValid: options.validity !== 'invalid',
    isFormatted: options.output !== 'plain',
    random: options.randomSource ?? Math.random,
  }
}

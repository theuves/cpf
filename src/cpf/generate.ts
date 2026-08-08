import { generateDocument } from '../core/document'
import { cpfSpec } from './spec'

export interface GenerateOptions {
  valid?: boolean
  count?: number
  formatted?: boolean
}

export type GenerateResult<Count extends number> = number extends Count
  ? string | string[]
  : Count extends 1
    ? string
    : string[]

// Function overloads for better type inference
export default function generate(
  options?: GenerateOptions & { count?: 1 }
): string
export default function generate<const Count extends number>(
  options: GenerateOptions & { count: Count }
): GenerateResult<Count>
export default function generate(
  options: GenerateOptions = {}
): string | string[] {
  const { valid = true, count = 1, formatted = true } = options
  return generateDocument(cpfSpec, { valid, count, formatted })
}

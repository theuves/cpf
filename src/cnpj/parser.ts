/* c8 ignore next */
import { parseDocument } from '../core/document'
import { cnpjSpec } from './spec'

export interface ParseResult {
  digits: number[]
  fullBody: number[]
  bodyParts: {
    part1: number[]
    part2: number[]
    part3: number[]
    part4: number[]
  }
  verifiers: number[]
}

export default function parser(cnpj: string): ParseResult {
  const parsed = parseDocument(cnpjSpec, cnpj, [2, 3, 3, 4])
  const part1 = parsed.bodyParts[0] as number[]
  const part2 = parsed.bodyParts[1] as number[]
  const part3 = parsed.bodyParts[2] as number[]
  const part4 = parsed.bodyParts[3] as number[]
  return {
    digits: parsed.digits,
    fullBody: parsed.fullBody,
    bodyParts: {
      part1,
      part2,
      part3,
      part4,
    },
    verifiers: parsed.verifiers,
  }
}

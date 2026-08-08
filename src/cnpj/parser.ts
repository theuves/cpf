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
  return {
    digits: parsed.digits,
    fullBody: parsed.fullBody,
    bodyParts: {
      part1: parsed.bodyParts[0] ?? [],
      part2: parsed.bodyParts[1] ?? [],
      part3: parsed.bodyParts[2] ?? [],
      part4: parsed.bodyParts[3] ?? [],
    },
    verifiers: parsed.verifiers,
  }
}
import { parseDocument } from '../core/document'
import { cnpjSpec } from './spec'

export interface ParseResult {
  digits: number[]
  fullBody: number[]
  bodyParts: {
    part1: number[]
    part2: number[]
    part3: number[]
  }
  lastBodyDigit: number | null
  verifiers: number[]
}

export default function parser(cpf: string): ParseResult {
  const parsed = parseDocument(cpfSpec, cpf, [3, 3, 3])
  return {
    digits: parsed.digits,
    fullBody: parsed.fullBody,
    bodyParts: {
      part1: parsed.bodyParts[0] ?? [],
      part2: parsed.bodyParts[1] ?? [],
      part3: parsed.bodyParts[2] ?? [],
    },
    lastBodyDigit:
      parsed.fullBody.length === cpfSpec.bodyLength
        ? (parsed.fullBody[cpfSpec.bodyLength - 1] ?? null)
        : null,
    verifiers: parsed.verifiers,
  }
}
import { parseDocument } from '../core/document'
import { cpfSpec } from './spec'

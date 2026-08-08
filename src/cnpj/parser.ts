/* c8 ignore next */
import { extractCnpjCharacters } from './codec'
import type { CnpjCharacter } from './codec'

export interface ParseResult {
  digits: CnpjCharacter[]
  fullBody: CnpjCharacter[]
  bodyParts: {
    part1: CnpjCharacter[]
    part2: CnpjCharacter[]
    part3: CnpjCharacter[]
    part4: CnpjCharacter[]
  }
  verifiers: CnpjCharacter[]
}

export default function parser(cnpj: string): ParseResult {
  const digits = extractCnpjCharacters(cnpj)
  const fullBody = digits.slice(0, Math.min(12, digits.length))
  return {
    digits,
    fullBody,
    bodyParts: {
      part1: fullBody.slice(0, 2),
      part2: fullBody.slice(2, 5),
      part3: fullBody.slice(5, 8),
      part4: fullBody.slice(8, 12),
    },
    verifiers: digits.slice(12),
  }
}

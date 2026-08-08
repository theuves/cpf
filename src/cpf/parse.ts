/* c8 ignore next */
import normalize from './normalize'
import { cpfSpec } from './spec'

export interface ParseResult {
  value: string
  body: string
  checkDigits: string
  regionDigit: string
}

export default function parse(cpf: string): ParseResult {
  const value = normalize(cpf)
  if (value.length !== cpfSpec.totalLength) {
    throw new Error(`CPF must contain exactly ${cpfSpec.totalLength} digits`)
  }
  return {
    value,
    body: value.slice(0, cpfSpec.bodyLength),
    checkDigits: value.slice(cpfSpec.bodyLength),
    regionDigit: value[cpfSpec.bodyLength - 1] as string,
  }
}

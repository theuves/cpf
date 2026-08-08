/* c8 ignore next */
import normalize from './normalize'

export interface ParseResult {
  value: string
  root: string
  branch: string
  checkDigits: string
}

export default function parse(cnpj: string): ParseResult {
  const value = normalize(cnpj)
  if (value.length !== 14) {
    throw new Error('CNPJ must contain exactly 14 characters')
  }
  return {
    value,
    root: value.slice(0, 8),
    branch: value.slice(8, 12),
    checkDigits: value.slice(12),
  }
}

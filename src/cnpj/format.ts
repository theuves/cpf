/* c8 ignore next */
import { cleanCnpj, formatCnpjCharacters } from './codec'

export interface FormatOptions {
  strict?: boolean
}

export default function format(
  cnpj: string | number,
  options: FormatOptions = {}
): string {
  const strict = options.strict ?? true
  let value: unknown = cnpj
  if (typeof value === 'number') {
    if (strict) {
      throw new Error('Number input is only allowed when strict=false')
    }
    value = value.toString().padStart(14, '0')
  }
  if (typeof value !== 'string') {
    throw new Error('Input must be a string or number')
  }
  return formatCnpjCharacters(cleanCnpj(value, strict))
}

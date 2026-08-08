/* c8 ignore next */
import { cleanCnpj } from './codec'

export interface UnformatOptions {
  strict?: boolean
}

export default function unformat(
  cnpj: string,
  options: UnformatOptions = {}
): string {
  if (typeof cnpj !== 'string') {
    throw new Error('Input must be a string')
  }
  return cleanCnpj(cnpj, options.strict ?? true)
}

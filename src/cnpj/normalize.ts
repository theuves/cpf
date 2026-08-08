/* c8 ignore next */
import { cleanCnpj } from './codec'

export default function normalize(cnpj: string): string {
  if (typeof cnpj !== 'string') {
    throw new Error('Input must be a string')
  }
  return cleanCnpj(cnpj.toUpperCase(), true)
}

/* c8 ignore next */
import { calculateCnpjVerifiers, isStructurallyValidCnpj } from './codec'

export default function isValid(cnpj: string): boolean {
  if (!isStructurallyValidCnpj(cnpj)) return false

  const characters = cnpj.replace(/[^A-Z0-9]/g, '')
  if (/^(\d)\1{13}$/.test(characters)) return false

  const [first, second] = calculateCnpjVerifiers(characters.slice(0, 12))
  return characters.slice(12) === `${first}${second}`
}

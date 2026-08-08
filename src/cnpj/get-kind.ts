/* c8 ignore next */
import { isStructurallyValidCnpj } from './codec'
import type { CnpjKind } from './codec'

export default function getKind(cnpj: unknown): CnpjKind | null {
  if (!isStructurallyValidCnpj(cnpj)) return null
  const characters = cnpj.replace(/[^A-Z0-9]/g, '')
  return /[A-Z]/.test(characters.slice(0, 12)) ? 'alphanumeric' : 'numeric'
}

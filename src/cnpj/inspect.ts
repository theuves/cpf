/* c8 ignore next */
import { calculateCnpjVerifiers, hasValidCnpjCharacters } from './codec'
import type { DocumentIssueCode, InspectionResult } from '../core/types'

export type { DocumentIssueCode, InspectionResult }

export default function inspect(cnpj: unknown): InspectionResult {
  if (typeof cnpj !== 'string') {
    return { valid: false, normalized: null, issue: 'INVALID_TYPE' }
  }
  if (!hasValidCnpjCharacters(cnpj)) {
    return { valid: false, normalized: null, issue: 'INVALID_CHARACTERS' }
  }

  const characters = cnpj.replace(/[^A-Z0-9]/g, '')
  if (characters.length !== 14) {
    return { valid: false, normalized: characters, issue: 'INVALID_LENGTH' }
  }
  if (!/^\d{2}$/.test(characters.slice(12))) {
    return {
      valid: false,
      normalized: characters,
      issue: 'INVALID_VERIFIER_CHARACTERS',
    }
  }
  if (/^(\d)\1{13}$/.test(characters)) {
    return {
      valid: false,
      normalized: characters,
      issue: 'REPEATED_CHARACTERS',
    }
  }

  const [first, second] = calculateCnpjVerifiers(characters.slice(0, 12))
  if (characters.slice(12) !== `${first}${second}`) {
    return {
      valid: false,
      normalized: characters,
      issue: 'INVALID_CHECK_DIGITS',
    }
  }
  return { valid: true, normalized: characters }
}

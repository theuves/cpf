/* c8 ignore next */
const STRICT_PATTERN =
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-\d{2}$/
const VALID_CHARACTERS = /^[A-Z0-9.\-/\s]+$/
const PARTIAL_PATTERNS = [
  /^[A-Z0-9]{0,1}$/,
  /^[A-Z0-9]{2}\.?[A-Z0-9]{0,3}$/,
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.?[A-Z0-9]{0,3}$/,
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/?[A-Z0-9]{0,4}$/,
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-?\d{0,2}$/,
]

export interface FormatMatchOptions {
  completeness?: 'complete' | 'partial'
}

export default function matchesFormat(
  cnpj: string,
  options: FormatMatchOptions = {}
): boolean {
  if (typeof cnpj !== 'string') return false
  const { completeness = 'complete' } = options
  if (completeness !== 'complete' && completeness !== 'partial') {
    throw new Error('Completeness must be complete or partial')
  }
  if (completeness === 'complete') return STRICT_PATTERN.test(cnpj)

  const trimmed = cnpj.trim()
  if (trimmed === '') return true
  if (!VALID_CHARACTERS.test(trimmed)) return false
  return PARTIAL_PATTERNS.some(pattern => pattern.test(trimmed))
}

/* c8 ignore next */
const STRICT_PATTERN =
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-\d{2}$/
const VALID_CHARACTERS = /^[A-Z0-9.\-/\s]+$/
const PARTIAL_PATTERNS = [
  /^[A-Z0-9]{2}\.?[A-Z0-9]{0,3}$/,
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.?[A-Z0-9]{0,3}$/,
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/?[A-Z0-9]{0,4}$/,
  /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-?\d{0,2}$/,
]

export interface CheckOptions {
  strict?: boolean
}

export default function check(
  cnpj: string,
  options: CheckOptions = {}
): boolean {
  if (typeof cnpj !== 'string') return false
  if (options.strict ?? true) return STRICT_PATTERN.test(cnpj)

  const trimmed = cnpj.trim()
  if (!VALID_CHARACTERS.test(trimmed)) return false
  return PARTIAL_PATTERNS.some(pattern => pattern.test(trimmed))
}

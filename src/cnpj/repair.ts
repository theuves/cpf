/* c8 ignore next */
import { calculateCnpjVerifiers, getCnpjAlphabet } from './codec'
import type { CnpjMode } from './codec'
import validate from './validate'

export interface RepairOptions {
  placeholder?: string
  mode?: CnpjMode
}

export default function repair(
  cnpjBroken: string,
  options: RepairOptions = {}
): string[] {
  if (typeof cnpjBroken !== 'string') return []

  const inferredPlaceholder = inferPlaceholder(cnpjBroken)
  const placeholder = options.placeholder ?? inferredPlaceholder
  const legacyVerifierPlaceholder =
    options.placeholder === undefined && inferredPlaceholder === 'X'
  if (!/^[^A-Z0-9.\-/\s]$/.test(placeholder) && !legacyVerifierPlaceholder) {
    throw new Error(
      'Placeholder must be one non-alphanumeric, non-separator character'
    )
  }

  const escapedPlaceholder = escapeRegExp(placeholder)
  const clean = [...cnpjBroken]
    .filter(
      character => /^[A-Z0-9]$/.test(character) || character === placeholder
    )
    .join('')
  if (clean.length !== 14) return []

  const positions = [
    ...clean.matchAll(new RegExp(escapedPlaceholder, 'g')),
  ].map(match => match.index)
  if (positions.length === 0) return validate(clean) ? [clean] : []
  if (positions.length > 2) return []
  if (positions.length === 2 && !(positions[0] === 12 && positions[1] === 13)) {
    return []
  }

  const position = positions[0] as number
  if (position >= 12) {
    return repairVerifiers(clean, placeholder)
  }

  const inferredMode: CnpjMode = /[A-Z]/.test(clean)
    ? 'alphanumeric'
    : 'numeric'
  const alphabet = getCnpjAlphabet(options.mode ?? inferredMode)
  const repaired: string[] = []
  for (const character of alphabet) {
    const candidate = clean.replace(placeholder, character)
    if (validate(candidate)) repaired.push(candidate)
  }
  return repaired
}

function repairVerifiers(input: string, placeholder: string): string[] {
  const [first, second] = calculateCnpjVerifiers(input.slice(0, 12))
  let result = input
  if (result[12] === placeholder) {
    result = `${result.slice(0, 12)}${first}${result.slice(13)}`
  }
  if (result[13] === placeholder) {
    result = `${result.slice(0, 13)}${second}`
  }
  return validate(result) ? [result] : []
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function inferPlaceholder(input: string): string {
  const clean = input.replace(/[^A-Z0-9?]/g, '')
  const positions = [...clean.matchAll(/X/g)].map(match => match.index)
  return !clean.includes('?') &&
    positions.length > 0 &&
    positions.every(position => position >= 12)
    ? 'X'
    : '?'
}

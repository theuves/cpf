/* c8 ignore next */
import { calculateCnpjVerifiers, getCnpjAlphabet } from './codec'
import { MAX_REPAIR_INPUT_LENGTH } from '../core/document'
import type { CnpjKind } from './codec'
import isValid from './is-valid'

export interface RepairOptions {
  placeholder?: string
  kind?: CnpjKind
}

export default function findValidRepairs(
  cnpjBroken: string,
  options: RepairOptions = {}
): string[] {
  if (typeof cnpjBroken !== 'string') return []

  const placeholder = options.placeholder ?? '?'
  if (!/^[^A-Z0-9.\-/\s]$/.test(placeholder)) {
    throw new Error(
      'Placeholder must be one non-alphanumeric, non-separator character'
    )
  }
  if (
    options.kind !== undefined &&
    options.kind !== 'numeric' &&
    options.kind !== 'alphanumeric'
  ) {
    throw new Error('Kind must be numeric or alphanumeric')
  }
  if (cnpjBroken.length > MAX_REPAIR_INPUT_LENGTH) return []

  let clean = ''
  for (const character of cnpjBroken) {
    if (/^[A-Z0-9]$/.test(character) || character === placeholder) {
      clean += character
      if (clean.length > 14) return []
    } else if (!/^[.\-/\s]$/.test(character)) {
      return []
    }
  }
  if (clean.length !== 14) return []

  const positions: number[] = []
  for (let index = 0; index < clean.length; index++) {
    if (clean[index] === placeholder) positions.push(index)
  }
  if (positions.length === 0) {
    return isValid(clean) && matchesKind(clean, options.kind) ? [clean] : []
  }
  if (positions.length > 2) return []
  if (positions.length === 2 && !(positions[0] === 12 && positions[1] === 13)) {
    return []
  }

  const position = positions[0] as number
  if (position >= 12) {
    return matchesKind(clean, options.kind)
      ? repairVerifiers(clean, placeholder)
      : []
  }

  const inferredKind: CnpjKind = /[A-Z]/.test(clean)
    ? 'alphanumeric'
    : 'numeric'
  const alphabet = getCnpjAlphabet(options.kind ?? inferredKind)
  const repaired: string[] = []
  for (const character of alphabet) {
    const candidate = clean.replace(placeholder, character)
    if (isValid(candidate) && matchesKind(candidate, options.kind)) {
      repaired.push(candidate)
    }
  }
  return repaired
}

function matchesKind(input: string, kind: CnpjKind | undefined): boolean {
  if (kind === undefined) return true
  const isAlphanumeric = /[A-Z]/.test(input.slice(0, 12))
  return kind === 'alphanumeric' ? isAlphanumeric : !isAlphanumeric
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
  return isValid(result) ? [result] : []
}

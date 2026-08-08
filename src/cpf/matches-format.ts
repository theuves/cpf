/* c8 ignore next */
import { checkDocument } from '../core/document'
import { cpfSpec } from './spec'

export interface FormatMatchOptions {
  completeness?: 'complete' | 'partial'
}

export default function matchesFormat(
  cpf: string,
  options: FormatMatchOptions = {}
): boolean {
  const { completeness = 'complete' } = options
  if (completeness !== 'complete' && completeness !== 'partial') {
    throw new Error('Completeness must be complete or partial')
  }
  return checkDocument(cpfSpec, cpf, completeness === 'complete')
}

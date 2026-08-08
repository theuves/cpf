/* c8 ignore next */
import { formatDocument } from '../core/document'
import { cpfSpec } from './spec'

export interface FormatOptions {
  strict?: boolean
}

export default function format(
  cpf: string | number,
  options: FormatOptions = {}
): string {
  return formatDocument(cpfSpec, cpf, options.strict ?? true)
}

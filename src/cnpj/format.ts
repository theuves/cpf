/* c8 ignore next */
import { formatDocument } from '../core/document'
import { cnpjSpec } from './spec'

export interface FormatOptions {
  strict?: boolean
}

export default function format(
  cnpj: string | number,
  options: FormatOptions = {}
): string {
  return formatDocument(cnpjSpec, cnpj, options.strict ?? true)
}

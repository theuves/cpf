export interface FormatOptions {
  strict?: boolean
}

export default function format(
  cnpj: string | number,
  options: FormatOptions = {}
): string {
  return formatDocument(cnpjSpec, cnpj, options.strict ?? true)
}
import { formatDocument } from '../core/document'
import { cnpjSpec } from './spec'

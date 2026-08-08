export interface UnformatOptions {
  strict?: boolean
}

export default function unformat(
  cnpj: string,
  options: UnformatOptions = {}
): string {
  return unformatDocument(cnpjSpec, cnpj, options.strict ?? true)
}
import { unformatDocument } from '../core/document'
import { cnpjSpec } from './spec'

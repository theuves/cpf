import { checkDocument } from '../core/document'
import { cnpjSpec } from './spec'

export interface CheckOptions {
  strict?: boolean
}

export default function check(
  cnpj: string,
  options: CheckOptions = {}
): boolean {
  return checkDocument(cnpjSpec, cnpj, options.strict ?? true)
}

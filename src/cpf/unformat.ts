export interface UnformatOptions {
  strict?: boolean
}

export default function unformat(
  cpf: string,
  options: UnformatOptions = {}
): string {
  return unformatDocument(cpfSpec, cpf, options.strict ?? true)
}
import { unformatDocument } from '../core/document'
import { cpfSpec } from './spec'

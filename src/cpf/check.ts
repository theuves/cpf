import { checkDocument } from '../core/document'
import { cpfSpec } from './spec'

export interface CheckOptions {
  strict?: boolean
}

export default function check(
  cpf: string,
  options: CheckOptions = {}
): boolean {
  return checkDocument(cpfSpec, cpf, options.strict ?? true)
}

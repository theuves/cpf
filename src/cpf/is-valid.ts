/* c8 ignore next */
import { validateDocument } from '../core/document'
import { cpfSpec } from './spec'

export default function isValid(cpf: string): boolean {
  return validateDocument(cpfSpec, cpf)
}

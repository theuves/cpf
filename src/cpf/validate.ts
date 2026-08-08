import { validateDocument } from '../core/document'
import { cpfSpec } from './spec'

export default function validate(cpf: string): boolean {
  return validateDocument(cpfSpec, cpf)
}

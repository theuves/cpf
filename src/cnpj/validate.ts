import { validateDocument } from '../core/document'
import { cnpjSpec } from './spec'

export default function validate(cnpj: string): boolean {
  return validateDocument(cnpjSpec, cnpj)
}

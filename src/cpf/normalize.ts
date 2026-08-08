/* c8 ignore next */
import { unformatDocument } from '../core/document'
import { cpfSpec } from './spec'

export default function normalize(cpf: string): string {
  return unformatDocument(cpfSpec, cpf, true)
}

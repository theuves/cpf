/* c8 ignore next */
import { repairDocument } from '../core/document'
import { cpfSpec } from './spec'

export default function repair(cpfBroken: string): string[] {
  return repairDocument(cpfSpec, cpfBroken)
}

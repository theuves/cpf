import { repairDocument } from '../core/document'
import { cpfSpec } from './spec'

export default function findValidRepairs(cpfBroken: string): string[] {
  return repairDocument(cpfSpec, cpfBroken)
}

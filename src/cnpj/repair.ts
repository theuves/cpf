import { repairDocument } from '../core/document'
import { cnpjSpec } from './spec'

export default function repair(cnpjBroken: string): string[] {
  return repairDocument(cnpjSpec, cnpjBroken)
}

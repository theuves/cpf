/* c8 ignore next */
import { inspectDocument } from '../core/document'
import { cpfSpec } from './spec'
import type { DocumentIssueCode, InspectionResult } from '../core/types'

export type { DocumentIssueCode, InspectionResult }

export default function inspect(cpf: unknown): InspectionResult {
  return inspectDocument(cpfSpec, cpf)
}

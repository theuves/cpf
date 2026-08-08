/* c8 ignore next */
import { inspectDocument } from '../core/document'
import { cpfSpec } from './spec'
import type {
  CommonDocumentIssueCode,
  DocumentIssueCode,
  InspectionResult as CoreInspectionResult,
} from '../core/types'

export type CpfIssueCode = CommonDocumentIssueCode
export type InspectionResult = CoreInspectionResult<CpfIssueCode>
export type { DocumentIssueCode }

export default function inspect(cpf: unknown): InspectionResult {
  return inspectDocument(cpfSpec, cpf)
}

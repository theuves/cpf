export interface FormatSegment {
  readonly length: number
  readonly separator?: string
}

export interface DocumentSpec {
  readonly name: string
  readonly bodyLength: number
  readonly totalLength: number
  readonly weights: readonly [readonly number[], readonly number[]]
  readonly formatSegments: readonly FormatSegment[]
  readonly strictPattern: RegExp
  readonly partialPatterns: readonly RegExp[]
  readonly validCharsPattern: RegExp
}

export interface GenerateDocumentOptions {
  isValid: boolean
  isFormatted: boolean
}

export type DocumentIssueCode =
  | 'INVALID_TYPE'
  | 'INVALID_CHARACTERS'
  | 'INVALID_LENGTH'
  | 'INVALID_VERIFIER_CHARACTERS'
  | 'REPEATED_CHARACTERS'
  | 'INVALID_CHECK_DIGITS'

export type CommonDocumentIssueCode = Exclude<
  DocumentIssueCode,
  'INVALID_VERIFIER_CHARACTERS'
>

export type InspectionResult<
  IssueCode extends DocumentIssueCode = DocumentIssueCode,
> =
  | {
      readonly valid: true
      readonly normalized: string
    }
  | {
      readonly valid: false
      readonly normalized: string | null
      readonly issue: IssueCode
    }

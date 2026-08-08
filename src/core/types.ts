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

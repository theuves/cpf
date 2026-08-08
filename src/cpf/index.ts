import calculateCheckDigits from './calculate-check-digits'
import matchesFormat from './matches-format'
import format from './format'
import generate, { generateMany } from './generate'
import parse from './parse'
import findValidRepairs from './find-valid-repairs'
import getFiscalRegions from './get-fiscal-regions'
import normalize from './normalize'
import isValid from './is-valid'
import inspect from './inspect'
import type { FormatMatchOptions } from './matches-format'
import type { GenerationOptions } from './generate'
import type { ParseResult } from './parse'
import type { DocumentIssueCode, InspectionResult } from './inspect'

const cpf = {
  calculateCheckDigits,
  findValidRepairs,
  format,
  generate,
  generateMany,
  getFiscalRegions,
  isValid,
  inspect,
  matchesFormat,
  normalize,
  parse,
}

export {
  calculateCheckDigits,
  findValidRepairs,
  format,
  generate,
  generateMany,
  getFiscalRegions,
  isValid,
  inspect,
  matchesFormat,
  normalize,
  parse,
}
export type {
  DocumentIssueCode,
  FormatMatchOptions,
  GenerationOptions,
  InspectionResult,
  ParseResult,
}
export default cpf

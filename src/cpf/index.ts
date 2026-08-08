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
import type { FormatOptions } from './format'
import type { FormatMatchOptions } from './matches-format'
import type {
  GenerationOptions,
  GenerationOutput,
  GenerationValidity,
} from './generate'
import type { ParseResult } from './parse'
import type {
  CpfIssueCode,
  DocumentIssueCode,
  InspectionResult,
} from './inspect'

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
  CpfIssueCode,
  DocumentIssueCode,
  FormatOptions,
  FormatMatchOptions,
  GenerationOptions,
  GenerationOutput,
  GenerationValidity,
  InspectionResult,
  ParseResult,
}
export default cpf

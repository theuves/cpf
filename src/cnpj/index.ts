import calculateCheckDigits from './calculate-check-digits'
import matchesFormat from './matches-format'
import format from './format'
import generate, { generateMany } from './generate'
import parse from './parse'
import findValidRepairs from './find-valid-repairs'
import normalize from './normalize'
import isValid from './is-valid'
import inspect from './inspect'
import getKind from './get-kind'
import type { FormatOptions } from './format'
import type { FormatMatchOptions } from './matches-format'
import type {
  CnpjAsciiCharacter,
  CnpjBody,
  CnpjCharacter,
  CnpjKind,
} from './codec'
import type {
  GenerationOptions,
  GenerationOutput,
  GenerationValidity,
} from './generate'
import type { ParseResult } from './parse'
import type { RepairOptions } from './find-valid-repairs'
import type { DocumentIssueCode, InspectionResult } from './inspect'

const cnpj = {
  calculateCheckDigits,
  findValidRepairs,
  format,
  generate,
  generateMany,
  getKind,
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
  getKind,
  isValid,
  inspect,
  matchesFormat,
  normalize,
  parse,
}
export type {
  CnpjAsciiCharacter,
  CnpjBody,
  CnpjCharacter,
  CnpjKind,
  DocumentIssueCode,
  FormatOptions,
  FormatMatchOptions,
  GenerationOptions,
  GenerationOutput,
  GenerationValidity,
  InspectionResult,
  ParseResult,
  RepairOptions,
}
export default cnpj

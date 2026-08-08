import calculateCheckDigits from './calculate-check-digits'
import matchesFormat from './matches-format'
import format from './format'
import generate, { generateMany } from './generate'
import parse from './parse'
import findValidRepairs from './find-valid-repairs'
import getFiscalRegions from './get-fiscal-regions'
import normalize from './normalize'
import isValid from './is-valid'
import type { FormatMatchOptions } from './matches-format'
import type { GenerationOptions } from './generate'
import type { ParseResult } from './parse'

const cpf = {
  calculateCheckDigits,
  findValidRepairs,
  format,
  generate,
  generateMany,
  getFiscalRegions,
  isValid,
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
  matchesFormat,
  normalize,
  parse,
}
export type { FormatMatchOptions, GenerationOptions, ParseResult }
export default cpf

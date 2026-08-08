import calc from './calc'
import check from './check'
import format from './format'
import generate from './generate'
import parse from './parser'
import repair from './repair'
import rfs from './rfs'
import unformat from './unformat'
import validate from './validate'

/** @deprecated Use `validate` instead. */
const isValid = validate
/** @deprecated Use `unformat` instead. */
const clear = unformat
/** @deprecated Use `calc` instead. */
const getCD = calc

const cpf = {
  calc,
  check,
  clear,
  format,
  generate,
  getCD,
  isValid,
  parse,
  repair,
  rfs,
  unformat,
  validate,
}

export {
  calc,
  check,
  clear,
  format,
  generate,
  getCD,
  isValid,
  parse,
  repair,
  rfs,
  unformat,
  validate,
}

export type { CheckOptions } from './check'
export type { FormatOptions } from './format'
export type { GenerateOptions } from './generate'
export type { ParseResult } from './parser'
export type { UnformatOptions } from './unformat'

export default cpf

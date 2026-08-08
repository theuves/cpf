import calc from './calc'
import check from './check'
import format from './format'
import generate from './generate'
import parse from './parser'
import repair from './repair'
import unformat from './unformat'
import validate from './validate'

const cnpj = {
  calc,
  check,
  format,
  generate,
  parse,
  repair,
  unformat,
  validate,
}

export { calc, check, format, generate, parse, repair, unformat, validate }

export type { CheckOptions } from './check'
export type { FormatOptions } from './format'
export type { GenerateOptions } from './generate'
export type { ParseResult } from './parser'
export type { UnformatOptions } from './unformat'

export default cnpj

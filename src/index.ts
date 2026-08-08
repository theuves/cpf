import cpf, {
  calc as cpfCalc,
  check as cpfCheck,
  clear,
  format as cpfFormat,
  generate as cpfGenerate,
  getCD,
  isValid,
  parse as cpfParse,
  repair as cpfRepair,
  rfs as cpfRfs,
  unformat as cpfUnformat,
  validate as cpfValidate,
} from './cpf/index'
import cnpj, {
  calc as cnpjCalc,
  check as cnpjCheck,
  format as cnpjFormat,
  generate as cnpjGenerate,
  parse as cnpjParse,
  repair as cnpjRepair,
  unformat as cnpjUnformat,
  validate as cnpjValidate,
} from './cnpj/index'

export {
  clear,
  cnpj,
  cnpjCalc,
  cnpjCheck,
  cnpjFormat,
  cnpjGenerate,
  cnpjParse,
  cnpjRepair,
  cnpjUnformat,
  cnpjValidate,
  cpf,
  cpfCalc,
  cpfCheck,
  cpfFormat,
  cpfGenerate,
  cpfParse,
  cpfRepair,
  cpfRfs,
  cpfUnformat,
  cpfValidate,
  getCD,
  isValid,
}

export type { CheckOptions as CnpjCheckOptions } from './cnpj/check'
export type { CnpjBody, CnpjCharacter, CnpjMode } from './cnpj/codec'
export type { FormatOptions as CnpjFormatOptions } from './cnpj/format'
export type { GenerateOptions as CnpjGenerateOptions } from './cnpj/generate'
export type { ParseResult as CnpjParseResult } from './cnpj/parser'
export type { RepairOptions as CnpjRepairOptions } from './cnpj/repair'
export type { UnformatOptions as CnpjUnformatOptions } from './cnpj/unformat'
export type { CheckOptions as CpfCheckOptions } from './cpf/check'
export type { FormatOptions as CpfFormatOptions } from './cpf/format'
export type { GenerateOptions as CpfGenerateOptions } from './cpf/generate'
export type { ParseResult as CpfParseResult } from './cpf/parser'
export type { UnformatOptions as CpfUnformatOptions } from './cpf/unformat'

export default cpf

import cpf from './cpf/index'
import cnpj from './cnpj/index'

export { cnpj, cpf }
export type {
  FormatMatchOptions as CnpjFormatMatchOptions,
  GenerationOptions as CnpjGenerationOptions,
  InspectionResult as CnpjInspectionResult,
  ParseResult as CnpjParseResult,
} from './cnpj/index'
export type { CnpjKind } from './cnpj/codec'
export type {
  FormatMatchOptions as CpfFormatMatchOptions,
  GenerationOptions as CpfGenerationOptions,
  InspectionResult as CpfInspectionResult,
  ParseResult as CpfParseResult,
} from './cpf/index'
export type { DocumentIssueCode } from './core/types'

export default cpf

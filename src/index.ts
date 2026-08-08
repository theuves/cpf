import cpf from './cpf/index'
import cnpj from './cnpj/index'

export { cnpj, cpf }
export type {
  CnpjAsciiCharacter,
  CnpjCharacter,
  FormatOptions as CnpjFormatOptions,
  FormatMatchOptions as CnpjFormatMatchOptions,
  GenerationOptions as CnpjGenerationOptions,
  GenerationOutput as CnpjGenerationOutput,
  GenerationValidity as CnpjGenerationValidity,
  InspectionResult as CnpjInspectionResult,
  ParseResult as CnpjParseResult,
} from './cnpj/index'
export type { CnpjKind } from './cnpj/codec'
export type {
  CpfIssueCode,
  FormatOptions as CpfFormatOptions,
  FormatMatchOptions as CpfFormatMatchOptions,
  GenerationOptions as CpfGenerationOptions,
  GenerationOutput as CpfGenerationOutput,
  GenerationValidity as CpfGenerationValidity,
  InspectionResult as CpfInspectionResult,
  ParseResult as CpfParseResult,
} from './cpf/index'
export type { DocumentIssueCode } from './core/types'

export default cpf

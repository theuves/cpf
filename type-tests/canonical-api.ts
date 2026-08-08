import cpf, { cnpj } from '../src/index'
import type {
  CnpjBody,
  CnpjCharacter,
  CnpjKind,
  FormatOptions as CnpjFormatOptions,
  GenerationOptions,
} from '../src/cnpj/index'
import type {
  CpfFormatOptions,
  CpfIssueCode,
  DocumentIssueCode,
} from '../src/index'

const cpfValue: string = cpf.generate({ output: 'plain' })
const cpfValues: string[] = cpf.generateMany(2, {
  validity: 'invalid',
  randomSource: Math.random,
})
const cnpjValue: string = cnpj.generate({ kind: 'alphanumeric' })
const cnpjValues: string[] = cnpj.generateMany(2, { output: 'plain' })
const kind: CnpjKind = 'alphanumeric'
const body: CnpjBody = '12ABC34501DE'
const generation: GenerationOptions = { kind, randomSource: Math.random }
const issue: DocumentIssueCode = 'INVALID_CHECK_DIGITS'
const cpfIssue: CpfIssueCode = 'INVALID_CHECK_DIGITS'
const cpfFormatOptions: CpfFormatOptions = { strict: false }
const cnpjFormatOptions: CnpjFormatOptions = { strict: true }
const cnpjCharacter: CnpjCharacter = 'Z'

// @ts-expect-error CPF never reports verifier characters as a distinct issue.
const impossibleCpfIssue: CpfIssueCode = 'INVALID_VERIFIER_CHARACTERS'
// @ts-expect-error CNPJ array elements are numbers or single ASCII characters.
const invalidCnpjCharacter: CnpjCharacter = 'ABC'
// @ts-expect-error Legacy generation options are not part of the 3.x contract.
cpf.generate({ formatted: true })
// @ts-expect-error Generation validity uses semantic string values.
cnpj.generate({ validity: true })

cpf.parse(cpfValue).checkDigits satisfies string
cnpj.parse(cnpjValue).root satisfies string
cnpj.calculateCheckDigits(body)
cpf.inspect(cpfValue) satisfies
  | { readonly valid: true; readonly normalized: string }
  | {
      readonly valid: false
      readonly normalized: string | null
      readonly issue: DocumentIssueCode
    }
cnpj.getKind(cnpjValue) satisfies CnpjKind | null
void cpfValues
void cnpjValues
void generation
void issue
void cpfIssue
void cpfFormatOptions
void cnpjFormatOptions
void cnpjCharacter
void impossibleCpfIssue
void invalidCnpjCharacter

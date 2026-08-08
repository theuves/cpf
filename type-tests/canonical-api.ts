import cpf, { cnpj } from '../src/index'
import type { CnpjBody, CnpjKind, GenerationOptions } from '../src/cnpj/index'
import type { DocumentIssueCode } from '../src/index'

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

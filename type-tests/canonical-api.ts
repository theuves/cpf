import cpf, { cnpj } from '../src/index'
import type { CnpjBody, CnpjKind, GenerationOptions } from '../src/cnpj/index'

const cpfValue: string = cpf.generate({ output: 'plain' })
const cpfValues: string[] = cpf.generateMany(2, { validity: 'invalid' })
const cnpjValue: string = cnpj.generate({ kind: 'alphanumeric' })
const cnpjValues: string[] = cnpj.generateMany(2, { output: 'plain' })
const kind: CnpjKind = 'alphanumeric'
const body: CnpjBody = '12ABC34501DE'
const generation: GenerationOptions = { kind, randomSource: Math.random }

cpf.parse(cpfValue).checkDigits satisfies string
cnpj.parse(cnpjValue).root satisfies string
cnpj.calculateCheckDigits(body)
void cpfValues
void cnpjValues
void generation

import cnpj from '../src/cnpj/index'
import type {
  CnpjBody,
  CnpjCharacter,
  CnpjMode,
  RepairOptions,
} from '../src/cnpj/index'

const numericBody: CnpjBody = [1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0, 1]
const alphanumericBody: CnpjBody = '12ABC34501DE'
const mode: CnpjMode = 'alphanumeric'
const repairOptions: RepairOptions = { mode, placeholder: '?' }

const numericVerifiers: [number, number] = cnpj.calc(numericBody)
const alphanumericVerifiers: [number, number] = cnpj.calc(alphanumericBody)
const parsedBody: CnpjCharacter[] = cnpj.parse('12.ABC.345/01DE-35').fullBody
const repaired: string[] = cnpj.repair('12.ABC.345/01DE-3?', repairOptions)

void numericVerifiers
void alphanumericVerifiers
void parsedBody
void repaired

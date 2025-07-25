import validate from './validate'
import calc from './calc'

export default function repair(cnpjBroken: string): string[] {
  if (typeof cnpjBroken !== 'string') return []

  const cleanCnpj = cnpjBroken.replace(/[^0-9X]/g, '')
  if (cleanCnpj.length !== 14) return []

  const xCount = (cleanCnpj.match(/X/g) || []).length
  if (xCount === 0) {
    return validate(cleanCnpj) ? [cleanCnpj] : []
  }
  if (xCount > 2) return []
  if (xCount === 2 && !(cleanCnpj[12] === 'X' && cleanCnpj[13] === 'X')) return []

  if (xCount === 1) {
    return repairSingleX(cleanCnpj)
  }

  if (xCount === 2) {
    return repairTwoVerifiers(cleanCnpj)
  }

  return []
}

function repairSingleX(cnpj: string): string[] {
  const xPosition = cnpj.indexOf('X')

  // If X is in the verifier digits, calculate directly
  if (xPosition === 12) {
    const body = cnpj
      .slice(0, 12)
      .split('')
      .map(d => parseInt(d))
    const verifiers = calc(body)
    if (verifiers[0] === undefined) return []
    const result = cnpj.replace('X', verifiers[0].toString())
    return validate(result) ? [result] : []
  }

  if (xPosition === 13) {
    const body = cnpj
      .slice(0, 12)
      .split('')
      .map(d => parseInt(d))
    const verifiers = calc(body)
    if (verifiers[0] === undefined || verifiers[1] === undefined) return []
    const result = cnpj.replace('X', verifiers[1].toString())
    return validate(result) ? [result] : []
  }

  // If X is in the base digits, test only 10 possibilities
  const validCnpjs: string[] = []
  for (let digit = 0; digit <= 9; digit++) {
    const testCnpj = cnpj.replace('X', digit.toString())
    if (validate(testCnpj)) {
      validCnpjs.push(testCnpj)
    }
  }
  return validCnpjs
}

function repairTwoVerifiers(cnpj: string): string[] {
  const body = cnpj
    .slice(0, 12)
    .split('')
    .map(d => parseInt(d))
  const verifiers = calc(body)
  if (verifiers[0] === undefined || verifiers[1] === undefined) return []
  const cnpjWithFirstVerifier = cnpj.replace('X', verifiers[0].toString())
  const result = cnpjWithFirstVerifier.replace('X', verifiers[1].toString())
  return validate(result) ? [result] : []
} 
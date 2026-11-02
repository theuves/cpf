import { calculateCnpjVerifiers } from './codec'
import type { CnpjBody } from './codec'

export default function calculateCheckDigits(body: CnpjBody): [number, number] {
  return calculateCnpjVerifiers(body)
}

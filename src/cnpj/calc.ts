/* c8 ignore next */
import { calculateCnpjVerifiers } from './codec'
import type { CnpjBody } from './codec'

export default function calc(body: CnpjBody): [number, number] {
  return calculateCnpjVerifiers(body)
}

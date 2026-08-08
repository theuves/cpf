import { calculateVerifiers } from '../core/document'
import { cnpjSpec } from './spec'

export default function calc(body: readonly number[]): [number, number] {
  return calculateVerifiers(cnpjSpec, body)
}

import { calculateVerifiers } from '../core/document'
import { cpfSpec } from './spec'

export default function calc(body: readonly number[]): [number, number] {
  return calculateVerifiers(cpfSpec, body)
}

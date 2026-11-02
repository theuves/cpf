import inspect from './inspect'

export default function isValid(cnpj: string): boolean {
  return inspect(cnpj).valid
}

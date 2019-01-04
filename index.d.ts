declare module 'cpf' {
  export function format(cpfNumber: string): string

  export function generate(): string
  export function generate(formatted: boolean): string
  export function generate(formatted: boolean, invalid: boolean): string

  export function isValid(cpfNumber: string): boolean
  export function isValid(cpfNumber: string, byLength: boolean): boolean
}

declare module 'cpf' {
  export function calcDv(cpf: string): string[]
  export function calcDv(cpf: string[]): string[]

  export function clear(cpf: string): string
  export function format(cpf: string): string

  export function format(cpf: string): string

  export function generate(): string
  export function generate(formatted:boolean): string
  export function generate(formatted:boolean, invalid:boolean): string

  export function isValid(cpf:string): boolean
  export function isValid(cpf:string, byLength: boolean): boolean
}


import cpf, { cnpj } from './index'

Object.assign(globalThis, {
  cpf: {
    ...cpf,
    cnpj,
  },
})

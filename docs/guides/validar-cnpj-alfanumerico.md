# Como validar CNPJ alfanumérico em JavaScript

A biblioteca `cpf` também exporta `cnpj`, com suporte a corpos numéricos ou
alfanuméricos. O corpo tem 12 caracteres `A-Z0-9`; os dois verificadores finais
continuam numéricos. O mesmo validador atende às duas representações.

## Valide CNPJ numérico e alfanumérico

```sh
npm install cpf
```

```ts
import { cnpj } from 'cpf'

cnpj.isValid('11.222.333/0001-81') // true
cnpj.isValid('12.ABC.345/01DE-35') // true
cnpj.isValid('12ABC34501DE35')     // true
cnpj.isValid('12ABC34501DE36')     // false
cnpj.isValid('12ABC34501DE3A')     // false: letra no verificador
```

Você também pode importar apenas o namespace CNPJ com
`import cnpj from 'cpf/cnpj'`. Em CommonJS, use
`const { cnpj } = require('cpf')`.

## Normalize minúsculas antes de validar

As funções `isValid` e `inspect` esperam letras maiúsculas. Para aceitar a
digitação em minúsculas, normalize a entrada e trate erros de caracteres ou
tamanho.

```ts
function isValidCnpjInput(input: string): boolean {
  try {
    return cnpj.isValid(cnpj.normalize(input))
  } catch {
    return false
  }
}

isValidCnpjInput('12.abc.345/01de-35') // true
```

Mantenha o documento como texto. Uma limpeza com `replace(/\D/g, '')` remove
letras que fazem parte do CNPJ; uma conversão numérica também perde zeros iniciais.

## Inspecione e classifique a entrada

```ts
cnpj.inspect('12ABC34501DE36')
// { valid: false, normalized: '12ABC34501DE36',
//   issue: 'INVALID_CHECK_DIGITS' }

cnpj.getKind('12ABC34501DE35')     // 'alphanumeric'
cnpj.getKind('11222333000181')     // 'numeric'
cnpj.getKind('12ABC')             // null
```

`getKind` classifica a estrutura; não verifica o valor matemático dos dígitos.
Use `isValid` ou `inspect` quando precisar dessa confirmação.

## Calcule os verificadores

```ts
cnpj.calculateCheckDigits('12ABC34501DE') // [3, 5]
```

O cálculo usa módulo 11 e o valor ASCII de cada caractere menos 48, conforme o
[manual de cálculo da Receita Federal](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf).
O [programa CNPJ Alfanumérico](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
reúne as orientações oficiais. A biblioteca verifica estrutura e dígitos; ela não
consulta existência, titularidade ou situação cadastral.

Veja também [máscaras de CPF e CNPJ](mascara-cpf-cnpj.md) e
[integração com React](cpf-cnpj-react.md).

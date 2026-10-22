# Como validar CPF em JavaScript e TypeScript

Use `cpf.isValid` para verificar o tamanho, os caracteres e os dois dígitos
verificadores de um CPF. A biblioteca aceita valores com ou sem máscara e retorna
um booleano. Essa verificação é local: não consulta a Receita Federal nem confirma
que o CPF foi emitido ou pertence a alguém.

## Instalação e primeiro exemplo

```sh
npm install cpf
```

```ts
import cpf from 'cpf'

cpf.isValid('529.982.247-25') // true
cpf.isValid('52998224725')   // true
cpf.isValid('52998224726')   // false: verificadores incorretos
cpf.isValid('11111111111')   // false: sequência repetida
cpf.isValid('')             // false: entrada incompleta
```

O mesmo código funciona em JavaScript. Os tipos TypeScript acompanham o pacote;
não é necessário instalar um pacote `@types` separado. Em CommonJS, use
`const { default: cpf } = require('cpf')`.

## Preserve o CPF como texto

Um CPF pode começar com zero. Mantenha o valor como `string` no formulário, no
JSON e no armazenamento. Converter com `Number` ou `parseInt` perde zeros à
esquerda antes mesmo de chamar a biblioteca.

```ts
const input = '012.345.678-90'
const normalized = cpf.normalize(input)
// '01234567890'

const valid: boolean = cpf.isValid(normalized)
```

`normalize` remove os separadores permitidos, mas não verifica os dígitos.
Entradas com caracteres inválidos ou comprimento excessivo lançam erro.

## Mostre o motivo da rejeição

`inspect` aplica as mesmas regras de validade e devolve a primeira falha.

```ts
const result = cpf.inspect('529.982.247-26')

if (!result.valid) {
  console.log(result.issue) // 'INVALID_CHECK_DIGITS'
}
```

Para dados recebidos de uma requisição, `inspect` aceita `unknown` e também
identifica tipos inesperados. Faça a validação novamente no servidor, mesmo
quando o formulário já tiver validado o valor no navegador.

## Máscara e validade são verificações diferentes

```ts
cpf.matchesFormat('529.982.247-26') // true: máscara completa
cpf.isValid('529.982.247-26')       // false: verificadores incorretos
cpf.format('5299822')              // '529.982.2': entrada parcial
```

Uma expressão regular pode verificar a máscara, mas não substitui o cálculo dos
verificadores. `isValid` aceita separadores permitidos fora da posição canônica;
se sua aplicação exige a máscara exata, combine as duas verificações.

Continue com [máscaras durante a digitação](mascara-cpf-cnpj.md) ou com o
[exemplo de formulário React](cpf-cnpj-react.md).

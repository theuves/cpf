# cpf

Biblioteca JavaScript e TypeScript para validar, inspecionar, formatar, normalizar,
gerar e reparar CPF e CNPJ. Suporta CNPJ numérico e alfanumérico.

[![CI](https://github.com/theuves/cpf/actions/workflows/ci.yml/badge.svg)](https://github.com/theuves/cpf/actions/workflows/ci.yml)
[![CodeQL](https://github.com/theuves/cpf/actions/workflows/codeql.yml/badge.svg)](https://github.com/theuves/cpf/actions/workflows/codeql.yml)

> A biblioteca confirma estrutura e dígitos verificadores. Ela não confirma
> identidade, titularidade, emissão ou situação cadastral.

> [!TIP]
> Quer entregar software mais rápido, simplificar sua infraestrutura ou reduzir custos de Cloud? Posso ajudar. [Conte sobre o seu desafio](https://esyyuh0nxyf.typeform.com/to/AbbttY1R).
> 
## Funcionalidades

- CPF e CNPJ com ou sem máscara;
- CNPJ numérico e alfanumérico;
- validação booleana ou diagnóstico detalhado;
- formatação de valores completos e parciais;
- normalização e parsing sem perda de zeros à esquerda;
- cálculo de dígitos verificadores;
- geração unitária ou em lote;
- busca de candidatos para documentos incompletos;
- ESM, CommonJS, TypeScript e bundle para navegador;
- zero dependências de runtime.

## Instalação

```sh
npm install cpf
```

## Uso

```ts
import cpf, { cnpj } from 'cpf'

cpf.isValid('529.982.247-25') // true
cpf.format('5299822') // '529.982.2'

cnpj.isValid('12.ABC.345/01DE-35') // true
cnpj.getKind('12.ABC.345/01DE-35') // 'alphanumeric'
```

## API

O export padrão e o export nomeado `cpf` contêm as operações de CPF. O export
nomeado `cnpj` contém as operações de CNPJ.

| Operação                                             | CPF | CNPJ | Retorno               |
| ---------------------------------------------------- | :-: | :--: | --------------------- |
| [`isValid`](#isvalidvalue)                           |  ✓  |  ✓   | `boolean`             |
| [`inspect`](#inspectvalue)                           |  ✓  |  ✓   | resultado de inspeção |
| [`matchesFormat`](#matchesformatvalue-options)       |  ✓  |  ✓   | `boolean`             |
| [`format`](#formatvalue-options)                     |  ✓  |  ✓   | `string`              |
| [`normalize`](#normalizevalue)                       |  ✓  |  ✓   | `string`              |
| [`parse`](#parsevalue)                               |  ✓  |  ✓   | partes semânticas     |
| [`calculateCheckDigits`](#calculatecheckdigitsbody)  |  ✓  |  ✓   | `[number, number]`    |
| [`findValidRepairs`](#findvalidrepairsvalue-options) |  ✓  |  ✓   | `string[]`            |
| [`generate`](#generateoptions)                       |  ✓  |  ✓   | `string`              |
| [`generateMany`](#generatemanycount-options)         |  ✓  |  ✓   | `string[]`            |
| [`getFiscalRegions`](#cpfgetfiscalregionsvalue)      |  ✓  |  —   | `string[]`            |
| [`getKind`](#cnpjgetkindvalue)                       |  —  |  ✓   | `CnpjKind \| null`    |

### `isValid(value)`

Confirma o comprimento, os caracteres, as regras de repetição e os dígitos
verificadores. Entradas inválidas retornam `false`; a função não lança erro para
tipos inesperados.

```ts
cpf.isValid('529.982.247-25') // true
cpf.isValid('529.982.247-26') // false

cnpj.isValid('11.222.333/0001-81') // true
cnpj.isValid('12.ABC.345/01DE-35') // true
```

As operações estritas de CNPJ esperam letras maiúsculas. Use `normalize` para
preparar uma entrada que possa conter letras minúsculas.

### `inspect(value)`

Executa as mesmas verificações de `isValid`, mas retorna o valor normalizado e,
em caso de falha, um código que identifica a primeira regra violada.

```ts
cpf.inspect('529.982.247-26')
// {
//   valid: false,
//   normalized: '52998224726',
//   issue: 'INVALID_CHECK_DIGITS'
// }

cnpj.inspect('12.ABC.345/01DE-35')
// { valid: true, normalized: '12ABC34501DE35' }
```

Os possíveis valores de `issue` são:

- `INVALID_TYPE`;
- `INVALID_CHARACTERS`;
- `INVALID_LENGTH`;
- `INVALID_VERIFIER_CHARACTERS` — somente CNPJ;
- `REPEATED_CHARACTERS`;
- `INVALID_CHECK_DIGITS`.

`normalized` é `null` quando não é possível normalizar a entrada com segurança.

### `matchesFormat(value[, options])`

Verifica somente a máscara. Não calcula nem confirma os dígitos verificadores.

```ts
cpf.matchesFormat('529.982.247-25') // true
cpf.matchesFormat('529.982', { completeness: 'partial' }) // true

cnpj.matchesFormat('12.ABC.345/01DE-35') // true
```

| Opção          | Valores               | Padrão     | Descrição                                               |
| -------------- | --------------------- | ---------- | ------------------------------------------------------- |
| `completeness` | `complete`, `partial` | `complete` | Exige a máscara completa ou aceita uma entrada parcial. |

### `format(value[, options])`

Aplica a máscara canônica e aceita strings parciais, o que permite seu uso
durante a digitação em formulários.

```ts
cpf.format('5299822') // '529.982.2'
cpf.format('52998224725') // '529.982.247-25'

cnpj.format('12ABC34501DE35') // '12.ABC.345/01DE-35'
```

| Opção    | Tipo      | Padrão | Descrição                                                                                              |
| -------- | --------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `strict` | `boolean` | `true` | Rejeita caracteres inválidos e valores maiores que o documento. Com `false`, limpa e limita a entrada. |

Entradas numéricas são aceitas somente com `strict: false` e devem ser inteiros
seguros não negativos. Prefira strings para preservar zeros à esquerda.

### `normalize(value)`

Remove a máscara sem remover zeros à esquerda. Em CNPJ, letras são convertidas
para maiúsculas.

```ts
cpf.normalize('529.982.247-25') // '52998224725'
cnpj.normalize('12.abc.345/01de-35') // '12ABC34501DE35'
```

### `parse(value)`

Exige uma representação completa depois de remover os separadores admitidos e
separa suas partes semânticas. Em CNPJ, converte letras para maiúsculas. `parse`
não confirma a posição da máscara nem os dígitos verificadores; use
`matchesFormat` e `isValid` para essas verificações.

```ts
cpf.parse('529.982.247-25')
// {
//   value: '52998224725',
//   body: '529982247',
//   checkDigits: '25',
//   regionDigit: '7'
// }

cnpj.parse('12.ABC.345/01DE-35')
// {
//   value: '12ABC34501DE35',
//   root: '12ABC345',
//   branch: '01DE',
//   checkDigits: '35'
// }
```

### `calculateCheckDigits(body)`

Calcula os dois dígitos verificadores. CPF recebe um array com nove dígitos;
CNPJ recebe uma string ou um array com os doze caracteres do corpo.

```ts
cpf.calculateCheckDigits([5, 2, 9, 9, 8, 2, 2, 4, 7]) // [2, 5]
cnpj.calculateCheckDigits('12ABC34501DE') // [3, 5]
```

### `findValidRepairs(value[, options])`

Retorna candidatos matematicamente válidos para uma posição desconhecida. CPF
usa `X` como marcador; CNPJ usa `?` por padrão.

```ts
cpf.findValidRepairs('5299822472X') // ['52998224725']
cnpj.findValidRepairs('12.ABC.345/01DE-3?') // ['12ABC34501DE35']
```

CNPJ permite configurar `placeholder` e restringir os candidatos com
`kind: 'numeric' | 'alphanumeric'`. Dois marcadores são aceitos somente nas
posições dos verificadores.

### `generate([options])`

Gera um CPF ou CNPJ e sempre retorna uma string.

```ts
cpf.generate()
cpf.generate({ validity: 'invalid', output: 'plain' })

cnpj.generate({ kind: 'alphanumeric' })
```

| Opção          | Valores ou tipo           | Padrão        | Disponibilidade |
| -------------- | ------------------------- | ------------- | --------------- |
| `validity`     | `valid`, `invalid`        | `valid`       | CPF e CNPJ      |
| `output`       | `formatted`, `plain`      | `formatted`   | CPF e CNPJ      |
| `randomSource` | `() => number`            | `Math.random` | CPF e CNPJ      |
| `kind`         | `numeric`, `alphanumeric` | `numeric`     | somente CNPJ    |

`randomSource` deve retornar um número no intervalo `[0, 1)`. A geração não é
criptograficamente segura e não garante unicidade.

### `generateMany(count[, options])`

Gera uma lista usando as mesmas opções de `generate`. `count` deve ser um
inteiro entre 1 e 10.000. Divida volumes maiores em lotes menores para evitar
reter todos os resultados em memória ao mesmo tempo.

```ts
cpf.generateMany(3, { output: 'plain' })
cnpj.generateMany(3, { kind: 'alphanumeric' })
```

### `cpf.getFiscalRegions(value)`

Retorna as UFs associadas ao nono dígito do corpo do CPF. A classificação não
valida os dígitos verificadores.

```ts
cpf.getFiscalRegions('529.982.247-25') // ['ES', 'RJ']
```

### `cnpj.getKind(value)`

Classifica uma estrutura completa como `numeric` ou `alphanumeric`. Retorna
`null` para uma estrutura incompatível e não confirma os dígitos verificadores.

```ts
cnpj.getKind('11.222.333/0001-81') // 'numeric'
cnpj.getKind('12.ABC.345/01DE-35') // 'alphanumeric'
```

## Validação e erros

As operações de consulta evitam exceções para entradas inválidas. Operações que
transformam dados ou recebem opções explícitas rejeitam contratos incorretos.

| Operação                       | Comportamento para entrada inválida                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| `isValid`                      | Retorna `false`.                                                                     |
| `inspect`                      | Retorna um resultado com `valid: false` e o código em `issue`.                       |
| `getKind`                      | Retorna `null`.                                                                      |
| `getFiscalRegions`             | Retorna `[]`.                                                                        |
| `matchesFormat`                | Retorna `false`; lança se `completeness` for inválido.                               |
| `format`, `normalize`, `parse` | Lançam para tipos, caracteres ou tamanhos incompatíveis com o contrato.              |
| `calculateCheckDigits`         | Lança para um corpo com tamanho ou caracteres inválidos.                             |
| `findValidRepairs`             | Retorna `[]`; CNPJ lança se `placeholder` for inválido.                              |
| `generate`, `generateMany`     | Lançam para opções inválidas, contagem fora de 1–10.000 ou fonte aleatória fora de `[0, 1)`. |

## Módulos e formatos

### ESM

```ts
import cpf, { cnpj } from 'cpf'
import { cpf as namedCpf } from 'cpf'

import cpfOnly, { isValid as isValidCpf } from 'cpf/cpf'
import cnpjOnly, { isValid as isValidCnpj } from 'cpf/cnpj'
```

Os subpaths oferecem o namespace como export padrão e cada operação como export
nomeado.

### CommonJS

```js
const { default: cpf, cpf: namedCpf, cnpj } = require('cpf')
const cpfOnly = require('cpf/cpf').default
const cnpjOnly = require('cpf/cnpj').default
```

### Navegador

O bundle IIFE expõe `globalThis.cpf`; o namespace CNPJ fica disponível em
`globalThis.cpf.cnpj`.

### TypeScript

O pacote inclui declarações para ESM e CommonJS. Os principais tipos públicos
são:

- `DocumentIssueCode`;
- `CpfIssueCode`, `CpfInspectionResult` e `CnpjInspectionResult`;
- `CpfGenerationOptions` e `CnpjGenerationOptions`;
- `CpfGenerationValidity`, `CnpjGenerationValidity`, `CpfGenerationOutput` e
  `CnpjGenerationOutput`;
- `CpfFormatOptions` e `CnpjFormatOptions`;
- `CpfFormatMatchOptions` e `CnpjFormatMatchOptions`;
- `CpfParseResult` e `CnpjParseResult`;
- `CnpjKind`, `CnpjCharacter` e `CnpjAsciiCharacter`.

O subpath `cpf/cnpj` também exporta `CnpjBody` e `RepairOptions`. Nos subpaths,
os tipos compartilhados são exportados sem os prefixos `Cpf` e `Cnpj`, como
`FormatOptions`, `GenerationOptions`, `GenerationValidity`, `GenerationOutput`,
`InspectionResult` e `ParseResult`.

## Migração da versão 2.x

A versão 3 remove os aliases e as opções legadas da série 2.x. Entre as mudanças
estão `validate` → `isValid`, `unformat` → `normalize`, `calc` →
`calculateCheckDigits` e `generate({ count })` → `generateMany(count)`.

Consulte o [guia de migração](docs/migration-v3.md) para a tabela completa de
equivalências e as mudanças de parsing, geração e CNPJ alfanumérico.

## Compatibilidade

- Node.js 16 ou mais recente;
- ESM e CommonJS;
- navegadores por meio do bundle IIFE;
- zero dependências de runtime.

## Documentação complementar

- [Contrato da API](docs/api-contract.md);
- [regras de domínio](docs/domain-rules.md);
- [migração da versão 2.x](docs/migration-v3.md);
- [compatibilidade e evolução](docs/compatibility.md);
- [política de suporte](docs/support-policy.md);
- [arquitetura](docs/architecture.md) e [decisões arquiteturais](docs/adr);
- [changelog](CHANGELOG.md);
- [segurança](SECURITY.md).

## Desenvolvimento e contribuição

```sh
npm run verify
```

Consulte o [guia de contribuição](CONTRIBUTING.md) antes de abrir um pull
request.

## Licença

Distribuído sob a [licença MIT](LICENSE).

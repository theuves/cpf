# CPF

Biblioteca TypeScript/JavaScript para validar, formatar, gerar e reparar números brasileiros de CPF e CNPJ.

Os formatos numérico e alfanumérico de CNPJ coexistem e são suportados pelo ciclo
completo da API. As 12 posições do corpo aceitam `0-9` e `A-Z`; os dois
verificadores permanecem numéricos.

## Instalação

```bash
npm install cpf
```

## Uso

O export padrão contém a API de CPF:

```js
import cpf from 'cpf'

cpf.validate('529.982.247-25') // true
cpf.format('52998224725') // '529.982.247-25'
cpf.parse('529.982.247-25').verifiers // [2, 5]
```

A API de CNPJ está disponível como export nomeado:

```js
import { cnpj } from 'cpf'

cnpj.validate('11.222.333/0001-81') // true
cnpj.validate('12.ABC.345/01DE-35') // true
cnpj.format('11222333000181') // '11.222.333/0001-81'
cnpj.parse('11.222.333/0001-81').verifiers // [8, 1]
```

CommonJS também é suportado:

```js
const cpf = require('cpf').default
const { cnpj } = require('cpf')
```

## API de CPF

### `cpf.validate(value)`

Retorna `true` quando o CPF possui 11 dígitos, não é uma sequência repetida e seus dígitos verificadores estão corretos. Pontos, hífen e espaços são aceitos.

```js
cpf.validate('529.982.247-25') // true
cpf.validate('111.111.111-11') // false
```

### `cpf.format(value, options?)`

Formata um valor completo ou parcial. Em modo estrito, usado por padrão, rejeita caracteres que não pertencem à formatação de CPF. Números são aceitos somente com `{ strict: false }`.

```js
cpf.format('52998224725') // '529.982.247-25'
cpf.format('529982') // '529.982'
cpf.format(52998224725, { strict: false }) // '529.982.247-25'
```

### `cpf.unformat(value, options?)`

Remove a formatação e retorna até 11 dígitos. Com `{ strict: false }`, ignora quaisquer caracteres e trunca o excedente.

```js
cpf.unformat('529.982.247-25') // '52998224725'
```

### `cpf.check(value, options?)`

Verifica apenas o formato, sem validar os dígitos verificadores. O modo padrão exige o formato completo; `{ strict: false }` também aceita entradas parciais.

```js
cpf.check('529.982.247-25') // true
cpf.check('529.982', { strict: false }) // true
```

### `cpf.generate(options?)`

Gera um CPF ou uma lista de CPFs. As opções são `valid` (padrão `true`), `formatted` (padrão `true`) e `count` (inteiro positivo, padrão `1`).

```js
cpf.generate()
cpf.generate({ formatted: false, valid: false })
cpf.generate({ count: 3 })
```

Quando `count` é `1`, o retorno é uma string; para valores maiores, é um array de strings.
Quando `count` é uma variável TypeScript do tipo `number`, o retorno é corretamente
inferido como `string | string[]`, pois o valor pode ser `1` em tempo de execução.

### `cpf.calc(body)`

Calcula os dois dígitos verificadores a partir dos nove dígitos do corpo.

```js
cpf.calc([1, 2, 3, 4, 5, 6, 7, 8, 9]) // [0, 9]
```

### `cpf.parse(value)`

Separa os dígitos, corpo, partes e verificadores de um CPF completo ou parcial.

```js
cpf.parse('529.982.247-25')
// { digits, fullBody, bodyParts, lastBodyDigit, verifiers }
```

### `cpf.repair(value)`

Retorna os CPFs válidos possíveis quando um ou dois dígitos desconhecidos são representados por `X`. Dois `X` são aceitos somente nas posições verificadoras.

```js
cpf.repair('529.982.247-2X') // ['52998224725']
```

### `cpf.rfs(value)`

Retorna as siglas dos estados associados à Região Fiscal indicada pelo nono dígito do CPF.

```js
cpf.rfs('123.456.789-09') // ['PR', 'SC']
```

## API de CNPJ

O objeto `cnpj` opera nos formatos numérico e alfanumérico:

- `cnpj.validate(value)`
- `cnpj.format(value, options?)`
- `cnpj.unformat(value, options?)`
- `cnpj.check(value, options?)`
- `cnpj.generate(options?)` — gera numérico por padrão; use `mode: 'alphanumeric'`
- `cnpj.calc(body)` — recebe string ou array com os 12 caracteres do corpo
- `cnpj.parse(value)` — separa corpo, partes e verificadores
- `cnpj.repair(value, options?)` — usa `?` como marcador não ambíguo

```js
cnpj.calc([1, 1, 2, 2, 2, 3, 3, 3, 0, 0, 0, 1]) // [8, 1]
cnpj.calc('12.ABC.345/01DE') // [3, 5]
cnpj.format('12ABC34501DE35') // '12.ABC.345/01DE-35'
cnpj.generate({ mode: 'alphanumeric' })
cnpj.repair('12.ABC.345/01DE-3?') // ['12ABC34501DE35']
cnpj.repair('11.222.333/0001-8X') // ['11222333000181']
```

O modo estrito aceita apenas letras ASCII maiúsculas, como a especificação
oficial. Com `{ strict: false }`, `format` e `unformat` convertem letras
minúsculas para maiúsculas, removem caracteres externos ao identificador e
truncam após 14 posições.

`parse` preserva letras como strings e mantém dígitos como números. Por exemplo,
o corpo de `12.ABC.345/01DE-35` é representado como
`[1, 2, 'A', 'B', 'C', 3, 4, 5, 0, 1, 'D', 'E']`.

No corpo, `X` é dado válido e nunca é inferido como lacuna. Por compatibilidade
com a 2.x, `X` ainda é reconhecido automaticamente nas posições dos
verificadores, nas quais letras não são permitidas. Novos códigos devem usar `?`
ou configurar outro marcador não alfanumérico com `placeholder`.

## Imports modulares

Todas as funções também possuem aliases nomeados com prefixo, evitando colisões entre CPF e CNPJ:

```js
import { cpfValidate, cpfGenerate, cnpjValidate, cnpjGenerate } from 'cpf'
```

Os tipos `CpfGenerateOptions` e `CnpjGenerateOptions` são exportados para consumidores TypeScript.

Também são exportados os tipos `CpfCheckOptions`, `CpfFormatOptions`,
`CpfUnformatOptions`, `CpfParseResult` e seus equivalentes com prefixo `Cnpj`,
além de `CnpjBody`, `CnpjCharacter`, `CnpjMode` e `CnpjRepairOptions`.

## Entradas específicas

É possível importar somente a API do documento desejado:

```js
import cpf from 'cpf/cpf'
import cnpj from 'cpf/cnpj'
```

## Compatibilidade com versões anteriores

Os aliases `isValid`, `clear` e `getCD` continuam disponíveis para CPF. Novos projetos devem usar `validate`, `unformat` e `calc`.

```js
cpf.isValid('529.982.247-25')
cpf.clear('529.982.247-25')
cpf.getCD([5, 2, 9, 9, 8, 2, 2, 4, 7])
```

## Navegador

O bundle `dist/cpf.min.js` cria o global `cpf`. A API de CNPJ fica em `cpf.cnpj`.

```html
<script src="cpf.min.js"></script>
<script>
  cpf.validate('529.982.247-25')
  cpf.cnpj.validate('12.ABC.345/01DE-35')
</script>
```

## Compatibilidade

A biblioteca suporta Node.js 16, 18, 20, 22 e 24. O pacote final é testado em CommonJS e ESM em todas essas versões.

As ferramentas de desenvolvimento exigem Node.js 18.18 ou superior.

Consulte a [política de suporte](docs/support-policy.md) para garantias de runtime,
tipos e manutenção. Validação confirma estrutura e dígitos verificadores; não
confirma identidade, emissão ou situação cadastral. A geração não oferece
unicidade nem aleatoriedade criptográfica.

## Desenvolvimento

```bash
npm run verify
```

`verify` executa typecheck dos fontes e testes, lint, formatação, cobertura, build e
instalação do tarball em um projeto temporário. O pacote instalado é verificado em
ESM, CommonJS, navegador e TypeScript.

As decisões internas estão descritas em [Arquitetura](docs/architecture.md), e o
comportamento compatível da versão atual em [Contrato da API 3.x](docs/api-contract.md).
As regras implementadas ficam em [Regras de domínio](docs/domain-rules.md), com
evolução planejada no [Roadmap](ROADMAP.md) e no
[guia de migração para a versão 3](docs/migration-v3.md).

Contribuições seguem [CONTRIBUTING.md](CONTRIBUTING.md). Vulnerabilidades devem
ser relatadas pelo processo privado descrito em [SECURITY.md](SECURITY.md).
O procedimento dos mantenedores está em [Processo de release](docs/releasing.md).

## Licença

MIT © Matheus Alves

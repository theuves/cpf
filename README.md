<div align="center">
  Documentação em progresso. Leia [esse README](https://github.com/theuves/cpf/tree/2.0.1) para a versão mais atualizada.
</div>

<div align="center">
  <h1>cpf</h1>
  Uma biblioteca completa para manipulação de CPF e CNPJ brasileiros.
  <br />
  <br />

  [![Doar Pix (Brasil)](https://img.shields.io/badge/Donate-Pix%20(Brasil)-blue.svg)](https://nubank.com.br/cobrar/193y02/67a7cf95-b24c-4a98-95b2-9ce5daf03e2c)
  [![Doar GitHub Sponsors](https://img.shields.io/badge/Donate-GitHub%20Sponsors-blue.svg)](https://github.com/sponsors/theuves)
  [![Doar PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/donate/?hosted_button_id=3TPLED2TF5874)
</div>

***

O projeto CPF.js foi criado com o objetivo de fornecer uma solução simples e eficiente para a manipulação de CPF e CNPJ brasileiros.

A motivação por trás deste projeto é atender a uma necessidade comum em diversas aplicações brasileiras, onde é frequentemente necessário validar, formatar e gerar CPFs e CNPJs para fins de documentação, formulários, testes e outros documentos formais.

Nossa ambição com o CPF.js é tornar esta biblioteca uma referência para desenvolvedores que precisam dessa funcionalidade em suas aplicações, promovendo a padronização e simplificação do processo de manipulação de documentos brasileiros.

## Funcionalidades

- [x] **Validação** de CPF e CNPJ com algoritmo oficial brasileiro
- [x] **Formatação** de CPF e CNPJ nos padrões brasileiros (XXX.XXX.XXX-XX / XX.XXX.XXX/XXXX-XX)
- [x] **Geração** de CPFs e CNPJs válidos e inválidos para testes
- [x] **Desformatação** de CPF e CNPJ (remoção de caracteres especiais)
- [x] **Verificação** de formato de CPF e CNPJ
- [x] **Cálculo** de dígitos verificadores de CPF e CNPJ
- [x] **Reparo** de CPFs com dígitos desconhecidos (representados por X) [`experimental`]
- [x] **Identificação de RF** (Região Fiscal) baseada no CPF [`experimental`]

_**NOTA**: As funcionalidades experimentais podem ter comportamento instável e estão sujeitas a mudanças._

## Instalação

```bash
npm install cpf
```

Ou se preferir, com Yarn:

```bash
yarn add cpf
```

## Uso

```js
import cpf from 'cpf'
```

### `cpf.validate(cpf)` [*string*]

> Valida se um CPF é válido de acordo com o algoritmo oficial brasileiro.

**Parâmetros:**
- `cpf` [*string*] - O CPF a ser validado (pode conter formatação)

**Retorna:** [*boolean*] - `true` se o CPF for válido, `false` caso contrário

**Exemplos:**

```js
cpf.validate('123.456.789-09')
//=> true

cpf.validate('12345678909')
//=> true

cpf.validate('111.111.111-11')
//=> false

cpf.validate('123.456.789-10')
//=> false
```

### `cpf.format(cpf[, strict])` [*string*, *boolean*]

> Formata um CPF no padrão brasileiro (XXX.XXX.XXX-XX).

**Parâmetros:**
- `cpf` [*string* | *number*] - O CPF a ser formatado
- `strict` [*boolean*] - Se `true` (padrão), valida caracteres permitidos

**Retorna:** [*string*] - CPF formatado

**Exemplos:**

```js
cpf.format('12345678909')
//=> '123.456.789-09'

cpf.format('12345678909', false)
//=> '123.456.789-09'

cpf.format('123456789')
//=> '123.456.789'

cpf.format(12345678909)
//=> Error: Number input is only allowed when strict=false
```

### `cpf.generate([options])` [*object*]

> Gera CPFs válidos ou inválidos para testes.

**Parâmetros:**
- `options` [*object*] - Opções de geração
  - `valid` [*boolean*] - Se deve gerar CPF válido (padrão: `true`)
  - `count` [*number*] - Quantidade de CPFs a gerar (padrão: `1`)
  - `formatted` [*boolean*] - Se deve retornar formatado (padrão: `true`)

**Retorna:** [*string* | *string[]*] - CPF(s) gerado(s)

**Exemplos:**

```js
cpf.generate()
//=> '123.456.789-09'

cpf.generate({ valid: true, formatted: true })
//=> '987.654.321-00'

cpf.generate({ valid: false, formatted: false })
//=> '12345678910'

cpf.generate({ count: 3 })
//=> ['123.456.789-09', '987.654.321-00', '456.789.123-45']
```

### `cpf.unformat(cpf[, strict])` [*string*, *boolean*]

> Remove a formatação de um CPF, retornando apenas os dígitos.

**Parâmetros:**
- `cpf` [*string*] - O CPF a ser desformatado
- `strict` [*boolean*] - Se `true` (padrão), valida caracteres permitidos

**Retorna:** [*string*] - CPF sem formatação

**Exemplos:**

```js
cpf.unformat('123.456.789-09')
//=> '12345678909'

cpf.unformat('123.456.789-09', false)
//=> '12345678909'
```

### `cpf.check(cpf[, strict])` [*string*, *boolean*]

> Verifica se um CPF está no formato correto.

**Parâmetros:**
- `cpf` [*string*] - O CPF a ser verificado
- `strict` [*boolean*] - Se `true` (padrão), verifica formato completo

**Retorna:** [*boolean*] - `true` se o formato estiver correto

**Exemplos:**

```js
cpf.check('123.456.789-09')
//=> true

cpf.check('12345678909', false)
//=> true

cpf.check('123.456.789')
//=> false

cpf.check('123.456.789', false)
//=> true
```

### `cpf.calc(body)` [*number[]*]

> Calcula os dígitos verificadores de um CPF a partir do corpo (9 primeiros dígitos).

**Parâmetros:**
- `body` [*number[]*] - Array com os 9 primeiros dígitos do CPF

**Retorna:** [*number[]*] - Array com os 2 dígitos verificadores

**Exemplos:**

```js
cpf.calc([1, 2, 3, 4, 5, 6, 7, 8, 9])
//=> [0, 9]
```

### `cpf.repair(cpfBroken)` [*string*]

> Repara CPFs com dígitos desconhecidos (representados por X).

**Parâmetros:**
- `cpfBroken` [*string*] - CPF com X nos dígitos desconhecidos

**Retorna:** [*string[]*] - Array com CPFs válidos possíveis

**Exemplos:**

```js
cpf.repair('123.456.789-0X')
//=> ['123.456.789-09']

cpf.repair('123.456.78X-09')
//=> ['123.456.789-09']
```

### `cpf.rfs(cpf)` [*string*]

> Identifica as Regiões Fiscais (RF) baseadas no CPF.

**Parâmetros:**
- `cpf` [*string*] - O CPF para identificar a RF

**Retorna:** [*string[]*] - Array com as siglas dos estados da RF

**Exemplos:**

```js
cpf.rfs('123.456.789-09')
//=> ['SP']

cpf.rfs('987.654.321-00')
//=> ['PR', 'SC']
```

## Suporte a CNPJ

A biblioteca também inclui suporte básico para CNPJ através da função `calc`:

```js
import { calc as cnpjCalc } from 'cpf'

// Calcula dígitos verificadores de CNPJ
cnpjCalc([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2])
//=> [3, 4]
```

## Características Técnicas

- **Zero dependências** - Biblioteca totalmente independente
- **TypeScript** - Tipagem completa para melhor experiência de desenvolvimento
- **Algoritmo oficial** - Implementação fiel ao algoritmo da Receita Federal
- **Flexibilidade** - Suporte a diferentes formatos de entrada
- **Performance** - Otimizada para uso em produção
- **Testes completos** - Cobertura de 100% dos casos de uso

## Contribuições

Encontrou algum erro ou tem alguma sugestão de melhoria? Há diferentes formas de contribuir:

- Abrindo uma issue para relatar problemas ou sugestões
- Enviando um pull request com melhorias
- Comentando diretamente no código que pode ser aprimorado

Toda contribuição é bem-vinda e ajuda a tornar a biblioteca ainda melhor.

## Licença

Criado e mantido por [Matheus Alves](https://github.com/theuves).

Licenciado sob a licença [MIT](https://github.com/theuves/cpf/blob/master/LICENSE) © 2015-2025

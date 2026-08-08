# cpf

Trabalhe com CPF e CNPJ — inclusive CNPJ alfanumérico — sem reimplementar
máscaras, normalização, validação ou dígitos verificadores.

A biblioteca atende desde campos de formulário até validações de domínio e
geração de dados para testes. Ela oferece ESM, CommonJS, tipos TypeScript e
bundle para navegador.

> A validação confirma estrutura e dígitos verificadores, não identidade,
> titularidade ou situação cadastral.

## Instalação

```sh
npm install cpf
```

```ts
import cpf, { cnpj } from 'cpf'
```

## Casos de uso

### Valide e explique o problema

Use `isValid` quando precisar apenas de uma resposta booleana. Quando a interface
precisar informar por que o valor foi rejeitado, use `inspect`:

```ts
cpf.isValid('529.982.247-25') // true

cpf.inspect('529.982.247-26')
// {
//   valid: false,
//   normalized: '52998224726',
//   issue: 'INVALID_CHECK_DIGITS'
// }
```

Os códigos de diagnóstico são estáveis e distinguem tipo, caracteres,
comprimento, repetição e dígitos verificadores inválidos.

### Formate enquanto o usuário digita

`format` aceita valores parciais, e `normalize` produz a representação adequada
para armazenamento ou comparação:

```ts
cpf.format('5299822') // '529.982.2'
cpf.format('52998224725') // '529.982.247-25'
cpf.normalize('529.982.247-25') // '52998224725'
```

Para verificar somente a máscara, sem afirmar que o documento é válido:

```ts
cpf.matchesFormat('529.982', { completeness: 'partial' }) // true
```

### Aceite o CNPJ alfanumérico

A mesma API trata CNPJs numéricos e o formato alfanumérico sem converter ou
descartar letras:

```ts
cnpj.isValid('12.ABC.345/01DE-35') // true
cnpj.getKind('12.ABC.345/01DE-35') // 'alphanumeric'
cnpj.normalize('12.abc.345/01de-35') // '12ABC34501DE35'
```

### Gere dados e repare entradas incompletas

Gere documentos válidos ou inválidos para testes e encontre candidatos quando
uma posição for desconhecida:

```ts
cpf.generate({ output: 'plain' })
cnpj.generateMany(3, { kind: 'alphanumeric' })

cpf.findValidRepairs('5299822472X') // ['52998224725']
```

A geração não é criptograficamente segura e não garante unicidade.

## O que a biblioteca oferece

| Necessidade                      | API                        |
| -------------------------------- | -------------------------- |
| Confirmar validade               | `isValid`, `inspect`       |
| Trabalhar com máscaras           | `format`, `matchesFormat`  |
| Remover a máscara                | `normalize`                |
| Separar partes semânticas        | `parse`                    |
| Calcular verificadores           | `calculateCheckDigits`     |
| Recuperar valores incompletos    | `findValidRepairs`         |
| Criar dados de teste             | `generate`, `generateMany` |
| Consultar regiões fiscais do CPF | `cpf.getFiscalRegions`     |
| Classificar o formato do CNPJ    | `cnpj.getKind`             |

CPF e CNPJ compartilham as operações principais. `getFiscalRegions` existe
somente para CPF; `getKind`, somente para CNPJ.

## Imports alternativos

Use subpaths quando quiser importar apenas um namespace:

```ts
import cpf from 'cpf/cpf'
import cnpj from 'cpf/cnpj'
```

## Documentação

- [Contrato completo da API](docs/api-contract.md): retornos, opções e erros de
  cada operação.
- [Regras de domínio](docs/domain-rules.md): cálculo, formatos e coexistência de
  CNPJ numérico e alfanumérico.
- [Migração da 2.x para a 3.x](docs/migration-v3.md): equivalência dos nomes e
  opções removidos.
- [Compatibilidade](docs/compatibility.md) e
  [política de suporte](docs/support-policy.md): runtimes e evolução da API.
- [Arquitetura](docs/architecture.md) e [ADRs](docs/adr): decisões internas para
  contribuidores.
- [Changelog](CHANGELOG.md): funcionalidades publicadas e ainda não lançadas.
- [Segurança](SECURITY.md) e [guia de contribuição](CONTRIBUTING.md).

Este README descreve o código da branch atual. A série 3.x removeu os nomes e
opções legados da API 2.x; consulte o guia de migração antes de atualizar.

## Desenvolvimento

```sh
npm run verify
```

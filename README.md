# cpf

Trabalhe com CPF e CNPJ numérico ou alfanumérico sem reimplementar validação,
normalização, formatação, geração ou cálculo de dígitos verificadores.
A série 3.x removeu os nomes e opções legados da API 2.x. Consulte o
[guia de migração](docs/migration-v3.md) antes de atualizar. Este README descreve
o código da branch atual; funcionalidades ainda não publicadas aparecem na seção
“Não lançado” do [changelog](CHANGELOG.md).

## Instalação

```sh
npm install cpf
```

## API canônica

```ts
import cpf, { cnpj } from 'cpf'

cpf.isValid('529.982.247-25')
cpf.inspect('529.982.247-26')
// { valid: false, normalized: '52998224726', issue: 'INVALID_CHECK_DIGITS' }
cpf.matchesFormat('529.982', { completeness: 'partial' })
cpf.normalize('529.982.247-25') // '52998224725'
cpf.calculateCheckDigits([5, 2, 9, 9, 8, 2, 2, 4, 7]) // [2, 5]
cpf.findValidRepairs('5299822472X') // ['52998224725']
cpf.getFiscalRegions('529.982.247-25') // ['ES', 'RJ']
cpf.generate({ output: 'plain' }) // string
cpf.generateMany(3, { validity: 'valid' }) // string[]
cpf.parse('529.982.247-25')
// { value: '52998224725', body: '529982247', checkDigits: '25', regionDigit: '7' }

cnpj.isValid('12.ABC.345/01DE-35')
cnpj.inspect('12.ABC.345/01DE-35')
// { valid: true, normalized: '12ABC34501DE35' }
cnpj.getKind('12.ABC.345/01DE-35') // 'alphanumeric'
cnpj.generate({ kind: 'alphanumeric', randomSource: Math.random }) // string
cnpj.parse('12.ABC.345/01DE-35')
// { value: '12ABC34501DE35', root: '12ABC345', branch: '01DE', checkDigits: '35' }
```

Ambos os namespaces oferecem `isValid`, `inspect`, `matchesFormat`, `normalize`,
`format`, `calculateCheckDigits`, `findValidRepairs`, `generate`, `generateMany`
e `parse`. CPF também oferece `getFiscalRegions`; CNPJ oferece `getKind`.

`inspect` valida o documento e, quando inválido, informa uma causa estável em
`issue`. `normalized` é `null` quando a entrada não é string ou contém caracteres
inválidos; nos demais casos, contém o valor sem separadores. `cnpj.getKind`
classifica uma estrutura completa como `numeric` ou `alphanumeric` sem confirmar
os dígitos verificadores, e retorna `null` quando a estrutura não pode ser
classificada.

`matchesFormat` recebe `{ completeness: 'complete' | 'partial' }`. A geração
recebe `validity: 'valid' | 'invalid'`, `output: 'formatted' | 'plain'` e
`randomSource`; CNPJ também recebe `kind: 'numeric' | 'alphanumeric'`.

`parse` aceita uma representação completa, normaliza a máscara e retorna apenas
campos semânticos em `string`. Ele não confirma os dígitos verificadores; use
`isValid` para isso.

## Referência rápida

| Operação | Resultado | Confirma os verificadores? |
| --- | --- | --- |
| `isValid` | Predicado booleano de validade | Sim |
| `inspect` | Validade, valor normalizado e causa da rejeição | Sim |
| `matchesFormat` | Compatibilidade com a máscara completa ou parcial | Não |
| `normalize` | Valor sem separadores | Não |
| `format` | Valor com a máscara canônica | Não |
| `calculateCheckDigits` | Dois verificadores calculados para um corpo | Não se aplica |
| `findValidRepairs` | Candidatos matematicamente válidos | Sim, nos retornos |
| `parse` | Partes semânticas do documento | Não |
| `generate` / `generateMany` | Um documento ou uma lista | Conforme `validity` |
| `cpf.getFiscalRegions` | UFs associadas ao dígito regional | Não |
| `cnpj.getKind` | `numeric`, `alphanumeric` ou `null` | Não |

## Imports

```ts
import cpf from 'cpf/cpf'
import cnpj from 'cpf/cnpj'
```

O pacote inclui ESM, CommonJS, tipos TypeScript e bundle de navegador.

## Desenvolvimento

```sh
npm run verify
```

Consulte o [contrato da API](docs/api-contract.md), o
[guia de migração](docs/migration-v3.md) e as [regras de domínio](docs/domain-rules.md).

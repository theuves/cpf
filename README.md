# cpf 3.0.0

Biblioteca TypeScript/JavaScript para CPF e CNPJ numérico ou alfanumérico.
Esta versão é uma migração incompatível da API 2.x: os nomes e opções legados
foram removidos. Consulte o [guia de migração](docs/migration-v3.md) antes de
atualizar.

## Instalação

```sh
npm install cpf
```

## API canônica

```ts
import cpf, { cnpj } from 'cpf'

cpf.isValid('529.982.247-25')
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
cnpj.generate({ kind: 'alphanumeric', randomSource: Math.random }) // string
cnpj.parse('12.ABC.345/01DE-35')
// { value: '12ABC34501DE35', root: '12ABC345', branch: '01DE', checkDigits: '35' }
```

Ambos os namespaces oferecem `isValid`, `matchesFormat`, `normalize`, `format`,
`calculateCheckDigits`, `findValidRepairs`, `generate`, `generateMany` e
`parse`. CPF também oferece `getFiscalRegions`.

`matchesFormat` recebe `{ completeness: 'complete' | 'partial' }`. A geração
recebe `validity: 'valid' | 'invalid'`, `output: 'formatted' | 'plain'` e
`randomSource`; CNPJ também recebe `kind: 'numeric' | 'alphanumeric'`.

`parse` aceita uma representação completa, normaliza a máscara e retorna apenas
campos semânticos em `string`. Ele não confirma os dígitos verificadores; use
`isValid` para isso.

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

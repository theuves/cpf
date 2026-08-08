# Migração explícita: 2.x → 3.0.0

A 3.0.0 remove a camada de compatibilidade. Não há aliases prefixados no export
raiz e não há nomes ou opções legadas nos namespaces de CPF e CNPJ.

| 2.x removido | 3.0.0 | Migração |
| --- | --- | --- |
| `validate` | `isValid` | Renomeie a chamada. |
| `check({ strict })` | `matchesFormat({ completeness })` | Use `'complete'` ou `'partial'`. |
| `unformat` | `normalize` | A normalização retorna a representação sem máscara. |
| `calc` | `calculateCheckDigits` | Renomeie a chamada. |
| `repair` | `findValidRepairs` | Para CNPJ, `mode` virou `kind`. |
| `rfs` | `getFiscalRegions` | Disponível apenas em CPF. |
| `clear`, `getCD` | — | Remova esses aliases. |
| `cpfX` / `cnpjX` no export raiz | `cpf.x` / `cnpj.x` | Importe o namespace. |
| `generate({ count })` | `generateMany(count)` | `generate` sempre devolve `string`. |
| `valid`, `formatted`, `mode`, `random` | `validity`, `output`, `kind`, `randomSource` | Atualize as opções. |

```ts
// 2.x
import cpf, { cnpjValidate } from 'cpf'
cpf.validate('529.982.247-25')
cpf.generate({ count: 3, formatted: false })

// 3.0.0
import cpf, { cnpj } from 'cpf'
cpf.isValid('529.982.247-25')
cpf.generateMany(3, { output: 'plain' })
cnpj.isValid('12.ABC.345/01DE-35')
```

## Parsing

O parser permissivo que descartava caracteres arbitrários e devolvia arrays de
números (ou de números e letras) foi removido. `parse` admite somente caracteres
do domínio e separadores conhecidos, exige o documento completo depois de
removê-los e retorna campos semânticos em strings. A posição dos separadores não
é validada por `parse`; use `matchesFormat` quando a máscara for relevante:

```ts
cpf.parse('529.982.247-25')
// { value, body, checkDigits, regionDigit }

cnpj.parse('12.ABC.345/01DE-35')
// { value, root, branch, checkDigits }
```

`parse` não é validação de máscara nem validação matemática. Para isso, use
`matchesFormat` e `isValid`, respectivamente. No CNPJ, `parse` também converte
letras minúsculas para maiúsculas.

## CNPJ alfanumérico

Use `kind: 'alphanumeric'` para geração. CNPJ aceita letras maiúsculas nas 12
posições do corpo e apenas dígitos nos verificadores. Em reparos, `?` é o
marcador padrão; `X` é uma letra válida do corpo e não é mais inferido como
marcador legado.

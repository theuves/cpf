# Contrato da API 3.x

O export padrão é o namespace CPF e `cnpj` é um export nomeado. Os subpaths
`cpf/cpf` e `cpf/cnpj` expõem os mesmos namespaces. O export raiz não contém
aliases de funções.

CPF expõe `isValid`, `inspect`, `matchesFormat`, `normalize`, `format`,
`calculateCheckDigits`, `findValidRepairs`, `generate`, `generateMany`, `parse`
e `getFiscalRegions`. CNPJ expõe o mesmo conjunto, exceto `getFiscalRegions`, e
também oferece `getKind`.

- `isValid` retorna `false` para entradas inválidas e confirma estrutura e
  dígitos verificadores.
- `inspect` confirma as mesmas regras de `isValid` e retorna um resultado
  discriminado. Sucesso contém `{ valid: true, normalized }`; falha contém
  `{ valid: false, normalized, issue }`.
- `issue` pode ser `INVALID_TYPE`, `INVALID_CHARACTERS`, `INVALID_LENGTH`,
  `INVALID_VERIFIER_CHARACTERS`, `REPEATED_CHARACTERS` ou
  `INVALID_CHECK_DIGITS`. A primeira regra aplicável nessa ordem é retornada;
  `INVALID_VERIFIER_CHARACTERS` existe apenas para CNPJ.
- Em `inspect`, `normalized` é `null` quando a entrada não é string ou contém
  caracteres inválidos. Nas demais falhas, preserva o conteúdo sem separadores.
- `cnpj.getKind` retorna `numeric`, `alphanumeric` ou `null`. Ele exige estrutura
  completa e caracteres estritos, mas não confirma os dígitos verificadores.
- `matchesFormat` verifica somente a máscara com
  `completeness: 'complete' | 'partial'`.
- Entradas numéricas de `format` são aceitas somente com `strict: false` e devem
  ser inteiros seguros não negativos.
- `normalize` devolve texto sem máscara, preservando zeros à esquerda; CNPJ
  converte letras minúsculas a maiúsculas.
- `generate(options)` retorna sempre `string` e
  `generateMany(count, options)` retorna sempre `string[]`.
- As opções de geração são `validity`, `output`, `randomSource` e, para CNPJ,
  `kind`. A fonte aleatória deve devolver um número em `[0, 1)`.
- `parse` exige o tamanho completo e retorna somente campos semânticos em
  `string`. Ele não atesta validade matemática.
- `findValidRepairs` devolve lista vazia quando não houver reparo válido.

Os nomes `validate`, `check`, `unformat`, `calc`, `repair`, `rfs`, `clear` e
`getCD`, bem como as opções `count`, `valid`, `formatted`, `mode` e `random`,
não fazem parte da API 3.x.

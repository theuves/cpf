# Contrato da API 3.0.0

O export padrão é o namespace CPF e `cnpj` é um export nomeado. Os subpaths
`cpf/cpf` e `cpf/cnpj` expõem os mesmos namespaces. O export raiz não contém
aliases de funções.

CPF expõe `isValid`, `matchesFormat`, `normalize`, `format`,
`calculateCheckDigits`, `findValidRepairs`, `generate`, `generateMany`, `parse`
e `getFiscalRegions`. CNPJ expõe o mesmo conjunto, exceto
`getFiscalRegions`.

- `isValid` retorna `false` para entradas inválidas e confirma estrutura e
  dígitos verificadores.
- `matchesFormat` verifica somente a máscara com
  `completeness: 'complete' | 'partial'`.
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
não fazem parte da API 3.0.0.

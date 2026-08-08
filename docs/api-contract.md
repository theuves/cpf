# Contrato da API 3.x

Este documento registra comportamentos públicos que devem permanecer compatíveis
durante a série 3.x.

## CNPJ numérico e alfanumérico

- As duas famílias coexistem na mesma API.
- O corpo possui 12 posições com `0-9` ou `A-Z`; os dois verificadores possuem
  somente `0-9`.
- Letras minúsculas não pertencem à representação oficial e são rejeitadas pelo
  modo estrito.
- `validate` aceita string formatada ou não, verifica estrutura e dígitos
  verificadores e rejeita o CNPJ numérico zerado e sequências numéricas repetidas
  já rejeitadas pela biblioteca.
- Validação matemática não confirma emissão nem situação cadastral.

## Formato e normalização

- `check` verifica somente a máscara. No modo padrão exige a representação
  canônica completa; com `strict: false`, aceita estados parciais documentados.
- `format` e `unformat` aceitam tanto o corpo numérico quanto o alfanumérico.
- No modo padrão, caracteres fora de `A-Z`, `0-9`, espaços e separadores conhecidos
  causam erro; excesso acima de 14 caracteres e letras nas posições verificadoras
  também causam erro.
- Com `strict: false`, letras são convertidas para maiúsculas, caracteres externos
  ao identificador são removidos e o resultado é truncado em 14 posições.
- `format` continua aceitando `number` somente com `strict: false` por
  compatibilidade. Identificadores devem ser armazenados como strings.

## Cálculo e parsing

- `cnpj.calc` aceita uma string, inclusive com máscara, ou um array de 12
  caracteres representados por números de `0` a `9` e strings `A-Z`.
- O cálculo converte cada caractere pelo valor ASCII menos 48, aplica os pesos
  oficiais e módulo 11.
- `cnpj.parse` é permissivo, extrai até 14 caracteres `A-Z0-9` e não implica
  validação.
- Para preservar o comportamento numérico anterior, dígitos do resultado de
  `parse` continuam sendo números; letras são strings.

## Geração

- `cnpj.generate` gera CNPJ numérico por padrão.
- `mode: 'alphanumeric'` gera um corpo contendo pelo menos uma letra e
  verificadores numéricos.
- Sem `count`, ou com `count: 1`, `generate` retorna uma string. Com um literal
  maior que `1`, retorna `string[]`; com `number` dinâmico, retorna
  `string | string[]` no TypeScript.
- `count` deve ser inteiro positivo e o lote é materializado em memória.
- `valid: false` altera deliberadamente o segundo verificador.
- `random` permite injetar uma fonte pseudoaleatória para testes. A biblioteca não
  garante unicidade nem aleatoriedade criptográfica.

## Reparo

- `cnpj.repair` usa `?` como marcador padrão para uma posição desconhecida.
- Um marcador pode aparecer em qualquer posição; dois são aceitos somente nas
  posições dos verificadores.
- `placeholder` permite escolher outro caractere não alfanumérico e diferente dos
  separadores da máscara.
- `mode` restringe candidatos do corpo a `numeric` ou permite o alfabeto
  `alphanumeric`. Sem a opção, o modo é inferido pelos caracteres conhecidos.
- `X` é sempre dado válido no corpo. Para compatibilidade com a 2.x, ele ainda é
  inferido como marcador quando aparece exclusivamente nas posições dos
  verificadores.
- Todo resultado é validado antes de ser retornado.

## CPF e empacotamento

- O contrato de CPF da série 2.x foi preservado.
- O export padrão continua sendo CPF; CNPJ permanece como export nomeado e pelo
  subpath `cpf/cnpj`.
- `isValid`, `clear` e `getCD` permanecem aliases depreciados de CPF.
- ESM, CommonJS, tipos TypeScript e o bundle global de navegador fazem parte do
  contrato publicado.

## Falhas

- `check` e `validate` representam entrada inválida com `false`.
- `repair` representa entrada sem solução com uma lista vazia.
- Transformações e cálculo podem lançar `Error` para tipo, caractere, comprimento
  ou opção inválida.
- Mensagens são diagnósticos humanos, não códigos estáveis.

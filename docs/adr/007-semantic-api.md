# ADR 007: vocabulário semântico da API pública

## Contexto

A API histórica mistura operações de predicado, transformação e busca de
candidatos em nomes curtos (`validate`, `check`, `calc`, `repair` e `rfs`). A
geração também usa um retorno condicional e opções booleanas cujo significado
precisa ser inferido pelo consumidor.

## Decisão

Na versão 3.0.0, estabelecer a camada canônica:

- `isValid` para predicados de validade;
- `matchesFormat` para máscara, com completude explícita;
- `normalize` para representação sem máscara;
- `calculateCheckDigits` para cálculo;
- `findValidRepairs` para busca de candidatos;
- `getFiscalRegions` para a regra exclusiva de CPF;
- `generate` para uma unidade e `generateMany` para um lote;
- `validity`, `output`, `kind` e `randomSource` para opções de geração.

A API canônica é o contrato publicado da 3.0.0. A compatibilidade com a 2.x é
tratada exclusivamente pelo guia de migração, não por nomes alternativos no novo
contrato.

## Consequências

Consumidores novos passam a ler a semântica pela assinatura. Consumidores 2.x
recebem uma migração major explícita. A versão 3 elimina retorno condicional de
`generate` e torna `parse` rigoroso.

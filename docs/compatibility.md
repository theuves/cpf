# Evolução de compatibilidade

## Série 3.x

Alterações na série 3.x devem ser retrocompatíveis. São permitidos:

- correções internas que preservem entradas e saídas;
- melhoria de inferência de tipos quando ela revela todos os retornos possíveis;
- novos testes, documentação e formatos auxiliares de declarations;
- novos exports que não alterem os existentes;
- avisos de depreciação.

## Evolução semântica na 3.0

A 3.0 adiciona uma camada canônica. Novos projetos devem
usar `isValid`, `matchesFormat`, `normalize`, `calculateCheckDigits`,
`findValidRepairs` e `generateMany`; CPF também oferece `getFiscalRegions`.

Os nomes anteriores continuam disponíveis até a próxima major. As opções de
geração também possuem formas canônicas: `validity`, `output`, `kind` e
`randomSource`. Combinar uma opção canônica com sua equivalente legada de forma
contraditória produz erro.

## Entregue na versão 3

O suporte ao CNPJ alfanumérico foi entregue como major porque ampliou tipos de
parsing, preservou letras no modo permissivo e tornou `X` um caractere válido do
corpo. A equivalência está em `docs/migration-v3.md`.

## Candidatos para uma versão futura

As mudanças abaixo não devem ser introduzidas silenciosamente em uma minor 3.x:

1. Remover entrada numérica de `format`, evitando perda de zeros e precisão.
2. Substituir `strict` por modos explícitos na API legada ou removê-lo.
3. Tornar truncamento uma opção explícita em vez de comportamento implícito.
4. Tornar `parse` estruturalmente rigoroso e retornar campos semânticos como
   strings, preservando `parse` permissivo somente como uma operação nomeada.
5. Remover a nomenclatura e as opções legadas após o período de depreciação.
6. Introduzir erros com códigos estáveis em lugar de interpretar mensagens.
7. Definir geração incremental e limites explícitos para lotes grandes.

Uma futura versão major deve incluir tabela de equivalência, exemplos
antes/depois e período de suporte definido para a major anterior.

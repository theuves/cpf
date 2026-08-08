# Evolução de compatibilidade

## Série 3.x

Alterações na série 3.x devem ser retrocompatíveis. São permitidos:

- correções internas que preservem entradas e saídas;
- melhoria de inferência de tipos quando ela revela todos os retornos possíveis;
- novos testes, documentação e formatos auxiliares de declarations;
- novos exports que não alterem os existentes;
- avisos de depreciação.

## Evolução semântica na 3.0

A 3.0 estabelece a API canônica descrita em `docs/api-contract.md`. Novos
projetos devem usar esses nomes; CPF também oferece `getFiscalRegions` e CNPJ
oferece `getKind`.

Os nomes e opções da 2.x foram removidos na 3.0. Não há aliases de runtime: a
equivalência existe somente no guia de migração. As opções de geração da 3.x são
`validity`, `output`, `randomSource` e, para CNPJ, `kind`.

## Entregue na versão 3

O suporte ao CNPJ alfanumérico foi entregue como major porque ampliou tipos de
parsing, preservou letras no modo permissivo e tornou `X` um caractere válido do
corpo. A equivalência está em `docs/migration-v3.md`.

Os exports aditivos `inspect` para CPF/CNPJ e `cnpj.getKind` ampliam a série 3.x
sem alterar o comportamento de `isValid`, `parse` ou das demais operações.

## Candidatos para uma versão futura

As mudanças abaixo não devem ser introduzidas silenciosamente em uma minor 3.x:

1. Remover entrada numérica de `format`, evitando perda de zeros e precisão.
2. Substituir `strict` por modos de entrada explícitos.
3. Tornar truncamento uma opção explícita em vez de comportamento implícito.
4. Introduzir tipos próprios para erros lançados, sem exigir interpretação de
   mensagens.
5. Definir geração incremental e limites explícitos para lotes grandes.

Uma futura versão major deve incluir tabela de equivalência, exemplos
antes/depois e período de suporte definido para a major anterior.

# Evolução de compatibilidade

## Série 3.x

Alterações na série 3.x devem ser retrocompatíveis. São permitidos:

- correções internas que preservem entradas e saídas;
- melhoria de inferência de tipos quando ela revela todos os retornos possíveis;
- novos testes, documentação e formatos auxiliares de declarations;
- novos exports que não alterem os existentes;
- avisos de depreciação.

## Entregue na versão 3

O suporte ao CNPJ alfanumérico foi entregue como major porque ampliou tipos de
parsing, preservou letras no modo permissivo e tornou `X` um caractere válido do
corpo. A equivalência está em `docs/migration-v3.md`.

## Candidatos para uma versão futura

As mudanças abaixo não devem ser introduzidas silenciosamente em uma minor 3.x:

1. Separar `generate()` e `generateMany()` para eliminar retorno condicional.
2. Remover entrada numérica de `format`, evitando perda de zeros e precisão.
3. Substituir `strict` por modos explícitos, como `digits`, `formatted` e `loose`.
4. Tornar truncamento uma opção explícita em vez de comportamento implícito.
5. Separar claramente normalização, parsing, verificação de formato e validação.
6. Remover os aliases `isValid`, `clear` e `getCD` após período de depreciação.
7. Introduzir erros com códigos estáveis em lugar de interpretar mensagens.
8. Definir geração incremental e limites explícitos para lotes grandes.

Uma futura versão major deve incluir tabela de equivalência, exemplos
antes/depois e período de suporte definido para a major anterior.

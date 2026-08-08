# Evolução de compatibilidade

## Série 2.x

Alterações na série 2.x devem ser retrocompatíveis. São permitidos:

- correções internas que preservem entradas e saídas;
- melhoria de inferência de tipos quando ela revela todos os retornos possíveis;
- novos testes, documentação e formatos auxiliares de declarations;
- novos exports que não alterem os existentes;
- avisos de depreciação.

## Candidatos para uma versão 3

As mudanças abaixo não devem ser introduzidas silenciosamente em uma versão 2.x:

1. Separar `generate()` e `generateMany()` para eliminar retorno condicional.
2. Remover entrada numérica de `format`, evitando perda de zeros e precisão.
3. Substituir `strict` por modos explícitos, como `digits`, `formatted` e `loose`.
4. Tornar truncamento uma opção explícita em vez de comportamento implícito.
5. Separar claramente normalização, parsing, verificação de formato e validação.
6. Remover os aliases `isValid`, `clear` e `getCD` após período de depreciação.
7. Introduzir erros com códigos estáveis em lugar de interpretar mensagens.
8. Definir geração incremental e limites explícitos para lotes grandes.

Uma versão 3 deve incluir uma tabela de equivalência, exemplos antes/depois e um
período em que a última versão 2.x permaneça disponível para correções críticas.

# ADR 003: preservar modos estrito e não estrito na série 2.x

- Status: aceito para compatibilidade; candidato a revisão na 3.x

## Contexto

O booleano `strict` controla vários comportamentos: caracteres, entrada numérica,
excesso de dígitos e aceitação de estados parciais. Ele é compacto, mas combina
decisões que um consumidor pode querer controlar separadamente.

## Decisão

Preservar exatamente o comportamento documentado na série 2.x. Não reinterpretar
o booleano nem endurecer entradas em uma release minor. Planejar modos explícitos
para uma major futura.

## Consequências

Correções internas devem executar os testes de contrato existentes. A
documentação precisa alertar sobre perda de zeros, precisão numérica e truncamento
permissivo. A 3.x deverá fornecer uma tabela de migração, não apenas renomear a
opção.

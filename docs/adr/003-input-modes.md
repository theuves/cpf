# ADR 003: preservar modos estrito e não estrito na série 2.x

- Status: aceito para a 2.x; comportamento residual preservado na 3.0.0

## Contexto

O booleano `strict` controla vários comportamentos: caracteres, entrada numérica,
excesso de dígitos e aceitação de estados parciais. Ele é compacto, mas combina
decisões que um consumidor pode querer controlar separadamente.

## Decisão

Preservar exatamente o comportamento documentado na série 2.x. Não reinterpretar
o booleano nem endurecer entradas em uma release minor. Planejar modos explícitos
para uma major futura.

## Evolução na 3.0.0

A ADR 007 substituiu o booleano de `check` por `completeness` em
`matchesFormat`, mas `format` ainda preserva `strict` para não combinar essa
migração com uma mudança adicional de tratamento de entrada. CNPJ também possui
operações canônicas, como `normalize`, cujo propósito explícito é converter
minúsculas para maiúsculas e que, portanto, não são classificadas por esse
booleano.

## Consequências

Correções internas devem executar os testes de contrato existentes. A
documentação precisa alertar sobre perda de zeros, precisão numérica e truncamento
permissivo. Uma versão major que remova o booleano deverá fornecer uma tabela de
migração, não apenas renomear a opção.

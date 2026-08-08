# ADR 005: mensagens de erro não são códigos públicos na série 2.x

- Status: aceito na 2.x e preservado na 3.x; erros lançados tipados permanecem adiados

## Contexto

Funções de transformação lançam `Error` com mensagens legíveis, enquanto funções
de verificação retornam `false` ou coleção vazia. Consumidores podem ter passado a
comparar mensagens, embora não exista uma taxonomia documentada.

## Decisão

Evitar mudanças desnecessárias nas mensagens durante a 2.x, mas não apresentá-las
como códigos estáveis. Documentar quais operações lançam, sem recomendar parsing
textual. Projetar erros com `code` discriminado para uma versão major.

## Consequências

Correções que alterem mensagens exigem avaliação de compatibilidade. A futura
taxonomia deve separar tipo, caractere, comprimento e opções inválidas, mantendo
mensagem humana independente do tratamento programático.

Os códigos discriminados adicionados por `inspect` na ADR 008 descrevem
resultados esperados de validação e são estáveis. Eles não transformam as
exceções lançadas pelas operações de transformação em erros tipados nem tornam
suas mensagens códigos públicos.

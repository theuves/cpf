# ADR 005: mensagens de erro não são códigos públicos na série 2.x

- Status: aceito para 2.x; erros tipados propostos para 3.x

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

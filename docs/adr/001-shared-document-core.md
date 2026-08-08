# ADR 001: núcleo compartilhado orientado por especificação

- Status: aceito para o domínio numérico; limite de CNPJ revisado pelo ADR 006
- Escopo: implementação interna da série 2.x

## Contexto

CPF e CNPJ compartilham cálculo, normalização, formatação, validação, geração e
reparo. Implementações independentes acumulavam divergências e exigiam correções
duplicadas.

## Decisão

Manter algoritmos puros em `src/core/document.ts` e representar diferenças em
`DocumentSpec`. Adaptadores públicos preservam tipos e resultados próprios de
cada domínio. Regras exclusivas, como regiões fiscais, ficam fora do núcleo.

## Alternativas

- Duplicar implementações: mais simples localmente, mas favorece divergência.
- Criar classes e herança: adiciona estado e extensão sem necessidade atual.
- Publicar um framework genérico: aumenta o contrato sem consumidor comprovado.

## Consequências

Invariantes comuns podem ser testadas uma vez contra ambas as especificações. O
núcleo permanece privado e não pode evoluir para acomodar um caso específico sem
demonstrar que a abstração continua válida para os dois documentos.

Na 3.0, o codec alfanumérico de CNPJ passou a ser um adaptador de domínio próprio.
Pesos e máscara continuam compartilhados, mas representação, normalização e
cálculo ASCII−48 não foram forçados sobre CPF.

# Migração para 3.x

Este é um documento de planejamento. Não existe uma API 3.x publicada e nenhum
exemplo abaixo deve ser tratado como disponível.

## Objetivos candidatos

| 2.x | Direção proposta para 3.x | Motivo |
| --- | --- | --- |
| `generate({ count })` | `generate()` e `generateMany()` | remover retorno condicional |
| lote materializado | `generateEach()` | controlar uso de memória |
| `strict: boolean` | modo de entrada explícito | tornar intenção legível |
| número em modo permissivo | somente string | preservar zeros e precisão |
| truncamento implícito | opção explícita ou erro | evitar perda silenciosa |
| `Error` por mensagem | erro com código estável | permitir tratamento programático |
| aliases legados | funções canônicas | reduzir superfície pública |
| CNPJ somente numérico | CNPJ numérico e alfanumérico | acompanhar o cadastro vigente |
| `X` como desconhecido de CNPJ | marcador sem conflito ou API posicional | `X` é válido no novo CNPJ |

## CNPJ alfanumérico

A migração precisa preservar CNPJs numéricos e adicionar o formato oficial como
um fluxo completo. Antes da release, a proposta deve definir:

- tipo dos 12 caracteres do corpo e dos dois verificadores;
- retorno de `calc` e `parse` sem conversões ambíguas;
- marcador de reparo que não conflite com `A-Z`;
- política de maiúsculas/minúsculas e formatação parcial;
- geração numérica, alfanumérica ou explicitamente selecionada;
- vetores oficiais e comparação com o simulador da Receita Federal.

Consulte `docs/adr/006-alphanumeric-cnpj.md` para o motivo de não oferecer suporte
parcial em uma minor da série 2.x.

## Processo antes da release

1. Validar cada mudança com casos reais de consumidores.
2. Registrar decisão e alternativas em ADR próprio.
3. Publicar tabela completa de antes/depois.
4. Fornecer codemod ou exemplos mecânicos quando aplicável.
5. Manter a última 2.x para correções críticas durante período anunciado.

## Compatibilidade

Até uma release major, `docs/api-contract.md` continua sendo a autoridade para a
série 2.x. Este documento não autoriza mudanças incompatíveis nessa série.

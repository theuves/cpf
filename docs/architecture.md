# Arquitetura

## Objetivo

A biblioteca mantém APIs públicas separadas para CPF e CNPJ, mas implementa as
operações comuns em um núcleo orientado por configuração. Isso evita que correções
de validação, formatação, geração e reparo precisem ser feitas duas vezes.

## Componentes

- `src/core/types.ts` define a especificação de um documento.
- `src/core/document.ts` contém algoritmos puros compartilhados.
- `src/cpf/spec.ts` e `src/cnpj/spec.ts` descrevem comprimento, pesos, formato e
  caracteres aceitos por cada documento.
- `src/cpf` e `src/cnpj` são adaptadores públicos, responsáveis pelos tipos e
  formatos de retorno específicos de cada domínio.
- `src/cpf/rfs.ts` permanece fora do núcleo porque regiões fiscais são uma regra
  exclusiva de CPF.

O núcleo não é exportado pelo `package.json`. Ele é um detalhe de implementação;
consumidores devem importar `cpf`, `cpf/cpf` ou `cpf/cnpj`.

## Distribuição

O build produz três formatos de runtime:

- ESM em `.mjs`;
- CommonJS em `.cjs`;
- IIFE para navegador em `.js`.

As declarações também possuem variantes por sistema de módulos:

- `.d.mts` para consumidores ESM com `moduleResolution: NodeNext`;
- `.d.cts` para consumidores CommonJS com `moduleResolution: NodeNext`;
- `.d.ts` como fallback para resoluções TypeScript tradicionais.

O teste de pacote cria um tarball, instala-o em um diretório temporário e verifica
os três runtimes e as duas formas de resolução de tipos. Assim, a validação cobre
o artefato entregue ao consumidor, e não somente os fontes do repositório.

## Princípios

- Funções públicas permanecem pequenas e orientadas ao domínio.
- O comportamento da versão 2 é preservado durante refatorações internas.
- Uma abstração só entra no núcleo quando é compartilhada pelos dois documentos.
- Extensões específicas, como regiões fiscais, não são generalizadas artificialmente.
- Alterações incompatíveis são reservadas para uma versão major e acompanhadas de
  um guia de migração.

## Decisões e limites

Os motivos e alternativas das decisões ficam em `docs/adr`. A arquitetura não
deve ser ampliada somente para antecipar documentos ou ambientes hipotéticos.
Uma mudança estrutural precisa identificar qual risco reduz, qual contrato afeta
e como será verificada no tarball entregue.

- `ADR 001`: núcleo compartilhado orientado por especificação;
- `ADR 002`: formatos ESM, CommonJS e IIFE;
- `ADR 003`: modos estrito e não estrito;
- `ADR 004`: retorno condicional de geração;
- `ADR 005`: tratamento público de erros.
- `ADR 006`: CNPJ alfanumérico como mudança coerente de versão major.

# ADR 002: suporte a ESM, CommonJS e IIFE

- Status: aceito, sujeito à política de suporte

## Contexto

Consumidores usam módulos Node modernos, projetos CommonJS existentes e inclusão
direta em navegador. Tipos TypeScript também resolvem extensões de maneira
diferente sob `NodeNext`.

## Decisão

Publicar ESM (`.mjs`), CommonJS (`.cjs`) e IIFE minificado, com subpaths explícitos
no mapa `exports`. Gerar declarações `.d.mts`, `.d.cts` e `.d.ts`. Testar o
tarball instalado, não apenas imports relativos dos fontes.

## Alternativas

- Somente ESM: reduz build, mas quebra consumidores 2.x.
- Bundle único dual-purpose: produz resolução ambígua entre ferramentas.
- Exportar todo `dist`: expõe detalhes internos como contrato acidental.

## Consequências

O pipeline é mais complexo e precisa de teste por ambiente. Um formato só pode
ser removido com dados de uso, aviso, documentação de migração e versão adequada.

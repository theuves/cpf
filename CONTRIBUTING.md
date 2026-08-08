# Contribuindo

## Antes de implementar

Abra uma issue para mudanças de API, regras de domínio ou compatibilidade. A
proposta deve explicar o problema do consumidor, alternativas, impacto na série
2.x e como a decisão será testada. Correções pequenas e inequivocamente
compatíveis podem ir diretamente para um pull request.

Não altere uma regra de CPF ou CNPJ apenas com base em exemplos de terceiros.
Inclua uma fonte normativa identificada, a data de consulta e vetores que
falhavam antes da mudança.

## Ambiente

Use uma versão de desenvolvimento indicada em `docs/support-policy.md`:

```bash
npm ci
npm run verify
```

`verify` valida fontes, testes, cobertura, build, tipos e o tarball instalado
como consumidor. Um pull request só está pronto quando esse comando passa sem
alterações não intencionais no artefato público.

## Critérios de pull request

- Preserve a API 2.x ou marque claramente a proposta como destinada à 3.x.
- Adicione teste de regressão ou propriedade para toda mudança comportamental.
- Prefira uma invariável compartilhada a listas extensas de exemplos repetidos.
- Atualize contrato, ADR, README e changelog quando forem afetados.
- Não dependa de aleatoriedade, relógio, rede ou estado global em testes.
- Explique riscos, rollback e efeitos para ESM, CommonJS, navegador e tipos.

## Commits e releases

Use mensagens descritivas no formato `tipo: resumo`, como `fix:`, `feat:`,
`docs:`, `test:` e `refactor:`. Mantenedores definem a versão pelo impacto no
contrato público; a data ou a quantidade de commits não determina a versão.

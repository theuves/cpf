# Contribuindo

## Antes de implementar

Abra uma issue para mudanças de API, regras de domínio ou compatibilidade. A
proposta deve explicar o problema do consumidor, alternativas, impacto na série
3.x e como a decisão será testada. Correções pequenas e inequivocamente
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
alterações não intencionais no artefato público. O CI também executa auditoria de
dependências e análise estática de segurança.

## Critérios de pull request

- Preserve o contrato público da série 3.x ou proponha explicitamente uma versão
  major futura com migração documentada.
- Adicione teste de regressão ou propriedade para toda mudança comportamental.
- Prefira uma invariável compartilhada a listas extensas de exemplos repetidos.
- Atualize contrato, ADR, README e changelog quando forem afetados.
- Não dependa de aleatoriedade, relógio, rede ou estado global em testes.
- Explique riscos, rollback e efeitos para ESM, CommonJS, navegador e tipos.

## Testes e cobertura

Use Node.js 24 ou superior para desenvolver. O pacote publicado continua
compatível com Node.js 16 ou superior, validado pela matriz de runtime do CI.

- `npm test`: compila os fontes e testes TypeScript em `.test-build/` e executa
  a suíte com `node:test` e asserções de `node:assert/strict`.
- `npm run test:coverage`: usa a cobertura nativa do Node, exige 100% de linhas,
  branches e funções e gera `coverage/lcov.info`.
- `npm run test:watch`: recompila os arquivos TypeScript e reexecuta os testes
  quando os arquivos compilados mudam.

A cobertura mede o JavaScript compilado, sem helpers de interoperabilidade,
loaders de TypeScript ou diretivas para ignorar branches artificiais. O preload
carrega todos os módulos elegíveis, incluindo os que ainda não têm testes.
Os arquivos de testes, entrypoints `index`, especificações declarativas,
tipos e o entrypoint de navegador ficam fora da medição. Os entrypoints públicos
e o bundle de navegador são verificados pelos testes de runtime e do pacote.
Não use diretivas de cobertura para esconder decisões de negócio ou fallbacks
executáveis; escreva o teste ou remova o ramo inalcançável.

## Commits e releases

Use mensagens descritivas no formato `tipo: resumo`, como `fix:`, `feat:`,
`docs:`, `test:` e `refactor:`. Mantenedores definem a versão pelo impacto no
contrato público; a data ou a quantidade de commits não determina a versão.
Releases são publicadas localmente pelo mantenedor conforme
`docs/releasing.md`; pull requests e automações não publicam o pacote.

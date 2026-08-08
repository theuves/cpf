# Processo de release

Releases são deliberadas: a versão representa impacto no contrato público, não a
quantidade de commits. A publicação nunca deve partir de um diretório com mudanças
locais ou dependências fora do lockfile.

## Preparação

1. Confirmar que o changelog descreve alterações para consumidores.
2. Classificar a versão por Versionamento Semântico.
3. Atualizar `package.json` e `package-lock.json` no mesmo commit.
4. Revisar alterações de API, `exports`, matriz de suporte e migração.
5. Executar `npm ci && npm run verify` em checkout limpo.
6. Aprovar e integrar o pull request de release.

## Publicação

O workflow `Release package` é manual e usa o ambiente protegido `npm`. Ele
executa `verify` novamente e inicia em modo dry-run. Para publicar:

1. Executar dry-run no commit exato da release.
2. Inspecionar nome, versão, conteúdo e tamanho reportados pelo npm.
3. Executar novamente com dry-run desativado e tag `latest` ou `next`.
4. Criar a GitHub Release a partir do mesmo commit e copiar as notas do changelog.
5. Instalar a versão publicada em um projeto vazio e repetir um smoke test.

Trusted publishing deve ser configurado no npm para este repositório e workflow.
Não adicionar token permanente ao arquivo ou ao código. A publicação solicita
provenance por OIDC.

## Falha e rollback

Pacotes npm publicados não são sobrescritos. Em caso de regressão:

- interromper novas adoções com a dist-tag apropriada;
- documentar o impacto;
- corrigir em nova versão;
- depreciar a versão defeituosa quando necessário.

Nunca reutilizar um número de versão nem reescrever a tag Git de uma release já
consumida.

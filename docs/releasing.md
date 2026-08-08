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

Releases são publicadas localmente pelo mantenedor. A máquina deve usar uma
versão suportada do Node.js, autenticação npm com 2FA e um checkout limpo do
commit exato da release.

1. Executar `npm ci && npm run verify`.
2. Inspecionar nome, versão, conteúdo e tamanho com `npm pack --dry-run`.
3. Publicar com `npm publish --access public --tag latest` ou trocar `latest` por
   `next` para uma prévia.
4. Criar e enviar a tag Git correspondente ao mesmo commit.
5. Criar a GitHub Release a partir da tag e copiar as notas do changelog.
6. Instalar a versão publicada em um projeto vazio e repetir um smoke test.

Não salvar token npm no repositório, em scripts versionados ou no histórico do
shell. A credencial pertence exclusivamente ao ambiente local do mantenedor.

## Falha e rollback

Pacotes npm publicados não são sobrescritos. Em caso de regressão:

- interromper novas adoções com a dist-tag apropriada;
- documentar o impacto;
- corrigir em nova versão;
- depreciar a versão defeituosa quando necessário.

Nunca reutilizar um número de versão nem reescrever a tag Git de uma release já
consumida.

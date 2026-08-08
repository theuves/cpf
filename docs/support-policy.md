# Política de suporte

## Runtime

A série 2.x suporta Node.js 16, 18, 20, 22 e 24. O CI executa o artefato compilado
em ESM e CommonJS em cada versão. O bundle IIFE é verificado como artefato de
navegador, mas o projeto não promete uma matriz nominal de navegadores sem uma
suíte real nesses ambientes.

Novas versões pares de Node podem ser adicionadas depois que o pacote publicado
passar na matriz. A remoção de uma versão exige aviso no changelog e, quando
incompatível com `engines`, uma release major.

## Desenvolvimento e tipos

- O build oficial usa Node.js 20 e `npm ci` com o lockfile versionado.
- Ferramentas locais exigem Node.js 18.18 ou superior.
- As declarações são verificadas com resolução `NodeNext` para consumidores ESM
  e CommonJS.
- A versão de TypeScript usada no CI é a fixada pelo lockfile. Outras versões não
  são implicitamente suportadas só porque conseguem consumir o pacote.

## Canais de manutenção

- Última 2.x: correções compatíveis e de segurança.
- 3.x futura: mudanças incompatíveis descritas em `docs/migration-v3.md`.
- Releases antigas: disponíveis sem manutenção garantida.

## Processo de alteração

Toda mudança na matriz deve atualizar `package.json`, CI, README e este documento
no mesmo pull request. O tarball precisa ser testado, pois sucesso contra os
fontes não comprova compatibilidade do pacote entregue.

# Segurança

## Versões suportadas

A série 3.x recebe correções de segurança. A última série 2.x recebe correções
críticas conforme a capacidade dos mantenedores; versões anteriores podem ser
usadas para reproduzir um problema, mas não recebem garantia de correção. Consulte
`docs/support-policy.md` para runtimes suportados.

## Relatando uma vulnerabilidade

Não publique detalhes exploráveis em uma issue aberta. Use um GitHub Security
Advisory privado no repositório e informe:

- versão e ambiente afetados;
- impacto observado;
- entrada mínima para reprodução;
- mitigação conhecida, se houver.

O recebimento deve ser confirmado antes de qualquer divulgação. Depois da
análise, mantenedores combinam escopo, correção, crédito e data de publicação com
quem relatou.

## Limites de segurança do pacote

Esta biblioteca valida estrutura e dígitos verificadores. Um retorno `true` não
confirma identidade, titularidade, emissão ou situação cadastral. A geração usa
`Math.random`, não oferece aleatoriedade criptográfica e não deve ser usada para
segredos, autenticação ou controle de acesso.

## Verificações automatizadas

Pull requests e pushes passam por auditoria de dependências com bloqueio para
vulnerabilidades de severidade alta ou crítica. O CodeQL analisa JavaScript e
TypeScript nesses eventos e semanalmente. Dependabot acompanha atualizações do
ecossistema npm e das GitHub Actions.

# Segurança

## Versões suportadas

A versão mais recente da série 2.x recebe correções de segurança. Versões
anteriores podem ser usadas para reproduzir um problema, mas não recebem garantia
de correção. Consulte `docs/support-policy.md` para runtimes suportados.

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

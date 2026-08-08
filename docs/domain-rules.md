# Regras de domínio

Este documento especifica o comportamento implementado. Ele não substitui uma
fonte normativa e não afirma que um número pertence a uma pessoa ou empresa.
Mudanças regulatórias devem trazer fonte, data de consulta, ADR e testes de
regressão no mesmo pull request.

## Vocabulário

- **corpo:** dígitos anteriores aos dois verificadores;
- **verificador:** dígito calculado a partir do corpo;
- **formato canônico:** representação com separadores nas posições documentadas;
- **válido:** comprimento, caracteres, repetição e verificadores aceitos pelo
  contrato da biblioteca.

## Cálculo comum

Para cada verificador, multiplica-se cada dígito pelo peso da posição, somam-se os
produtos e calcula-se o resto por 11. Restos menores que 2 produzem zero; os
demais produzem `11 - resto`. O segundo cálculo inclui o primeiro verificador.

O núcleo rejeita corpos com tamanho incorreto, valores não inteiros ou valores
fora do intervalo de 0 a 9. O array recebido não é modificado.

## CPF

- Corpo: 9 dígitos.
- Total: 11 dígitos.
- Pesos do primeiro verificador: 10 a 2.
- Pesos do segundo verificador: 11 a 2.
- Formato canônico: `000.000.000-00`.

Sequências com todos os dígitos iguais são rejeitadas mesmo quando o cálculo dos
verificadores coincidir. `cpf.rfs` interpreta o nono dígito do corpo segundo a
tabela versionada em `src/cpf/rfs.ts`; essa classificação não valida o CPF.

## CNPJ

### Escopo da série 2.x

A implementação atual cobre somente CNPJ numérico. Desde julho de 2026, novas
inscrições podem usar 12 posições alfanuméricas seguidas de dois verificadores
numéricos; CNPJs numéricos existentes permanecem válidos. Portanto, `validate`
retornar `false` para um CNPJ alfanumérico é uma limitação conhecida da série 2.x,
não uma declaração de inexistência cadastral.

Fontes oficiais consultadas em 8 de agosto de 2026:

- [programa CNPJ Alfanumérico da Receita Federal](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico);
- [manual oficial de cálculo do dígito verificador](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf);
- [Instrução Normativa RFB nº 2.119 compilada](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=127567&naoPublicado=&visao=compilado).

O novo cálculo mantém módulo 11 e converte cada caractere pelo código ASCII menos
48. A API 2.x não deve receber suporte parcial: seus contratos numéricos de
`calc`/`parse` e o uso de `X` por `repair` precisam ser redesenhados juntos.

### Formato numérico preservado

- Corpo: 12 dígitos.
- Total: 14 dígitos.
- Pesos do primeiro verificador: `5,4,3,2,9,8,7,6,5,4,3,2`.
- Pesos do segundo verificador: `6,5,4,3,2,9,8,7,6,5,4,3,2`.
- Formato canônico: `00.000.000/0000-00`.

Sequências com todos os dígitos iguais também são rejeitadas.

## Normalização e parsing

`validate` aceita somente strings e os caracteres permitidos pela especificação,
remove separadores e exige o total exato de dígitos. `parse` é deliberadamente
permissivo: extrai dígitos, trunca no tamanho total e não implica validação.

Os modos estrito e não estrito de `format`, `unformat` e `check` fazem parte da
compatibilidade 2.x e estão detalhados em `docs/api-contract.md`.

## Geração e reparo

Geração produz um corpo pseudoaleatório, corrige corpos repetidos, calcula os
verificadores e, com `valid: false`, altera o último verificador. Não há garantia
de unicidade nem de segurança criptográfica.

Reparo aceita um `X` em qualquer posição ou dois `X` apenas nas posições dos
verificadores. Todo candidato é validado antes de ser retornado.

## Checklist para mudar uma regra

1. Identificar a fonte normativa e a data de vigência.
2. Demonstrar a diferença em relação a esta especificação.
3. Decidir compatibilidade e versionamento em um ADR.
4. Adicionar vetores de regressão e propriedades compartilhadas.
5. Atualizar contrato, README, changelog e artefatos publicados.

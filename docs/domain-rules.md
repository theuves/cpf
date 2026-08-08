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
verificadores coincidir. `cpf.getFiscalRegions` interpreta o nono dígito do corpo segundo a
tabela versionada em `src/cpf/get-fiscal-regions.ts`; essa classificação não valida o CPF.

## CNPJ

### Formatos coexistentes

Desde julho de 2026, CNPJs numéricos e alfanuméricos coexistem. A implementação
aceita 12 posições de corpo com `0-9` e `A-Z`, seguidas por dois verificadores
exclusivamente numéricos. CNPJs existentes não são convertidos e novas inscrições
podem ser implantadas progressivamente nas duas famílias.

Fontes oficiais consultadas em 8 de agosto de 2026:

- [programa CNPJ Alfanumérico da Receita Federal](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico);
- [manual oficial de cálculo do dígito verificador](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf);
- [Instrução Normativa RFB nº 2.119 compilada](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=127567&naoPublicado=&visao=compilado).

O cálculo mantém módulo 11 e converte cada caractere pelo código ASCII menos 48.
Letras minúsculas são rejeitadas em modo estrito, conforme os vetores oficiais.

### Formato numérico preservado

- Corpo: 12 dígitos.
- Total: 14 dígitos.
- Pesos do primeiro verificador: `5,4,3,2,9,8,7,6,5,4,3,2`.
- Pesos do segundo verificador: `6,5,4,3,2,9,8,7,6,5,4,3,2`.
- Formato canônico: `00.000.000/0000-00`.

Sequências com todos os dígitos iguais também são rejeitadas.

### Formato alfanumérico

- Corpo: 12 caracteres `A-Z0-9`.
- Total: 14 caracteres; os dois últimos são dígitos.
- Pesos: os mesmos do formato numérico.
- Formato canônico: `AA.AAA.AAA/AAAA-00`.
- Conversão para cálculo: código ASCII do caractere menos 48.

O exemplo oficial `12.ABC.345/01DE-35` é um vetor de regressão. Letras podem
existir tanto na raiz quanto na ordem do estabelecimento.

## Normalização e parsing

`isValid` aceita somente strings e os caracteres permitidos pela especificação,
remove separadores e exige 12 caracteres de corpo e dois dígitos verificadores.
`parse` exige o documento completo, normaliza a máscara e não implica validação.
Seus campos semânticos são sempre strings.

`matchesFormat` usa `completeness: 'complete' | 'partial'`; o contrato completo
está em `docs/api-contract.md`.

## Geração e reparo

Geração numérica é o padrão para preservar previsibilidade. O modo alfanumérico
usa `A-Z0-9` e garante pelo menos uma letra no corpo. Ambos calculam os
verificadores e, com `validity: 'invalid'`, alteram o último verificador. Não há garantia
de unicidade nem de segurança criptográfica.

Reparo aceita `?` em qualquer posição ou dois marcadores apenas nas posições dos
verificadores. `X` é dado válido no corpo; a API 3.0.0 não infere marcadores
legados. Todo candidato é validado antes de ser retornado.

## Checklist para mudar uma regra

1. Identificar a fonte normativa e a data de vigência.
2. Demonstrar a diferença em relação a esta especificação.
3. Decidir compatibilidade e versionamento em um ADR.
4. Adicionar vetores de regressão e propriedades compartilhadas.
5. Atualizar contrato, README, changelog e artefatos publicados.

# ADR 008: diagnóstico de validade e classificação do CNPJ

- Status: implementado na série 3.x
- Data da decisão: 2026-08-08

## Contexto

`isValid` é adequado como predicado, mas seu retorno booleano não permite que
formulários, APIs e logs distingam comprimento incorreto, caracteres inválidos e
falha nos verificadores. Alterar seu retorno quebraria consumidores. Ao mesmo
tempo, a coexistência de CNPJ numérico e alfanumérico cria uma necessidade de
classificação que não deve ser confundida com validade matemática.

## Decisão

- Adicionar `inspect` aos namespaces CPF e CNPJ sem alterar `isValid`.
- Retornar uma união discriminada por `valid`. Falhas contêm um único `issue`,
  correspondente à primeira regra aplicável na ordem documentada.
- Usar códigos públicos estáveis e manter `normalized` como `null` quando a
  normalização descartaria tipo ou caracteres inválidos.
- Fazer `isValid` reutilizar a mesma inspeção, evitando divergência entre o
  predicado e o diagnóstico.
- Adicionar `cnpj.getKind`, que retorna `numeric`, `alphanumeric` ou `null`.
- Classificar somente estruturas completas e estritas, sem exigir verificadores
  matematicamente válidos.

## Alternativas

- Alterar `isValid` para devolver detalhes: rejeitada por quebrar seu contrato de
  predicado e a compatibilidade da série 3.x.
- Fazer `parse` validar e diagnosticar: rejeitada porque mistura decomposição com
  validade e altera uma semântica já documentada.
- Fazer `getKind` chamar `isValid`: rejeitada porque tipo de representação e
  validade dos verificadores são propriedades independentes.
- Lançar erros em `inspect`: rejeitada porque entradas inválidas são resultados
  esperados em validação, não falhas excepcionais.

## Consequências

Consumidores podem produzir mensagens próprias sem interpretar textos de erro.
Os códigos e a ordem de precedência passam a fazer parte do contrato semântico.
`getKind` pode classificar um CNPJ com verificadores incorretos, mas devolve
`null` para entrada incompleta, minúscula ou estruturalmente inválida.

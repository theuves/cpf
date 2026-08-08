# ADR 004: retorno condicional de `generate` na série 2.x

- Status: substituído pela ADR 007 na 3.0.0

## Contexto

`generate` retorna string para `count: 1` e array para contagens maiores. Isso é
conveniente em JavaScript, mas exige overloads e retorno unido quando `count` é
apenas `number` em TypeScript.

## Decisão histórica

Modelar fielmente o runtime com overloads e tipo condicional. Não prometer
unicidade. Rejeitar contagens que não sejam inteiros positivos. Não impor um novo
limite na série 2.x porque isso quebraria entradas hoje aceitas.

## Substituição na 3.0.0

A 3.0.0 separa as operações: `generate` retorna sempre uma string e
`generateMany` retorna sempre uma lista. As opções de geração adotam vocabulário
semântico. A ADR permanece apenas como contexto para consumidores da 2.x.

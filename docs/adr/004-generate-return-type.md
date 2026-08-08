# ADR 004: retorno condicional de `generate` na série 2.x

- Status: aceito para compatibilidade; candidato a separação na 3.x

## Contexto

`generate` retorna string para `count: 1` e array para contagens maiores. Isso é
conveniente em JavaScript, mas exige overloads e retorno unido quando `count` é
apenas `number` em TypeScript.

## Decisão

Modelar fielmente o runtime com overloads e tipo condicional. Não prometer
unicidade. Rejeitar contagens que não sejam inteiros positivos. Não impor um novo
limite na série 2.x porque isso quebraria entradas hoje aceitas.

## Consequências

Testes de tipo e do tarball protegem a inferência. A documentação alerta que lotes
grandes são materializados em memória. A 3.x pode separar geração unitária, lote
e iteração, depois de definir limites e nomes em proposta própria.

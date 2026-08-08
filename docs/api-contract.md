# Contrato da API 2.x

Este documento registra comportamentos que devem permanecer compatíveis durante a
série 2.x, inclusive quando não seriam a escolha ideal para uma nova API.

## Validação e formato

- `validate` recebe string, aceita dígitos e os separadores conhecidos em posições
  flexíveis, exige o comprimento completo, rejeita dígitos repetidos e verifica os
  dois dígitos verificadores.
- `check` verifica somente o formato. No modo padrão exige o formato canônico
  completo; com `strict: false`, aceita os estados parciais documentados.
- `format` aceita string e formata valores completos ou parciais.
- `unformat` recebe somente string e devolve os dígitos.
- No modo padrão, `format` e `unformat` rejeitam caracteres desconhecidos e excesso
  de dígitos, mas normalizam a posição de separadores permitidos.
- Com `strict: false`, caracteres não numéricos são ignorados e dígitos excedentes
  são truncados. `format` também aceita números nesse modo.

Identificadores devem ser armazenados como strings. O suporte a números existe por
compatibilidade, mas pode perder zeros à esquerda e precisão numérica.

## Geração

- Sem `count`, ou com `count: 1`, `generate` retorna uma string.
- Com um literal maior que `1`, retorna `string[]`.
- Com `count` tipado apenas como `number`, o retorno TypeScript é
  `string | string[]`, pois o valor em runtime pode ser `1`.
- `count` deve ser um inteiro positivo.
- `valid: false` gera deliberadamente um documento com verificador inválido.
- A geração não oferece garantia contratual de unicidade ou uso criptográfico.

## Parsing e reparo

- `parse` extrai dígitos, limita o resultado ao comprimento do documento e não
  implica validação.
- `repair` reconhece `X` maiúsculo como dígito desconhecido.
- Um único `X` pode aparecer em qualquer posição.
- Dois `X` são aceitos somente nas posições verificadoras.
- Resultados de `repair` são sempre validados antes de serem retornados.

## Compatibilidade

- O export padrão continua sendo a API de CPF.
- CNPJ continua disponível como export nomeado e pelo subpath `cpf/cnpj`.
- `isValid`, `clear` e `getCD` permanecem aliases depreciados de CPF.
- ESM, CommonJS e o bundle global de navegador fazem parte do contrato publicado.

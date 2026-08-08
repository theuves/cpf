# Migração da 2.x para 3.x

A versão 3 adiciona suporte completo ao CNPJ alfanumérico sem remover o formato
numérico. A Receita Federal mantém os dois formatos válidos em paralelo.

## O que permanece igual

- CNPJs numéricos continuam válidos e com o mesmo cálculo.
- `cnpj.generate()` continua gerando valores numéricos por padrão.
- As funções e imports públicos continuam disponíveis.
- O contrato de CPF não mudou.
- `X` nas posições dos verificadores continua funcionando como marcador legado.

## Mudanças necessárias

| 2.x | 3.x | Ação do consumidor |
| --- | --- | --- |
| `calc(number[])` | string ou array alfanumérico | arrays numéricos continuam válidos |
| `parse(...): number[]` | `(number \| string)[]` para campos de CNPJ | aceitar letras nos tipos |
| letras descartadas em modo permissivo | letras preservadas e normalizadas | revisar sanitização dependente do descarte |
| `X` desconhecido no corpo | `X` é dado válido | trocar a lacuna por `?` |
| geração apenas numérica | `mode` seleciona a família | usar `mode: 'alphanumeric'` quando necessário |

## Exemplos

```ts
import { cnpj } from 'cpf'

cnpj.validate('12.ABC.345/01DE-35') // true
cnpj.calc('12.ABC.345/01DE') // [3, 5]
cnpj.format('12ABC34501DE35') // '12.ABC.345/01DE-35'
cnpj.unformat('12.ABC.345/01DE-35') // '12ABC34501DE35'
cnpj.generate({ mode: 'alphanumeric' })
cnpj.repair('12.ABC.345/01DE-3?') // ['12ABC34501DE35']
```

Para parsing, altere a suposição de `number[]`:

```ts
const parsed = cnpj.parse('12.ABC.345/01DE-35')
// parsed.fullBody:
// [1, 2, 'A', 'B', 'C', 3, 4, 5, 0, 1, 'D', 'E']
```

## Checklist de rollout

1. Atualize tipos de banco e APIs para strings de 14 posições.
2. Remova regexes que aceitem somente `\d{14}`.
3. Confirme que comparações e índices preservam letras e zeros à esquerda.
4. Atualize usos de `repair` no corpo para `?`.
5. Execute testes com `12.ABC.345/01DE-35` e seus próprios contratos.
6. Publique consumidores antes de começar a receber dados alfanuméricos.

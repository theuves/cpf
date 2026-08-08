# ADR 009: limites operacionais para geração e reparos

- Status: implementado na série 3.x
- Data da decisão: 2026-08-08

## Contexto

`generateMany` validava apenas se a contagem era um inteiro positivo e usava
`Array.from` para materializar todo o lote. Uma contagem pequena em bytes, mas
numericamente alta, podia esgotar a memória e encerrar o processo. A busca de
reparos de CNPJ já descartava entradas acima de 64 caracteres; CPF processava a
entrada completa antes de descobrir que seu tamanho era inválido.

## Decisão

- Limitar `generateMany` de CPF e CNPJ a 10.000 resultados por chamada.
- Preservar a API síncrona e o retorno `string[]` dentro desse intervalo.
- Orientar consumidores a dividir volumes maiores em lotes menores.
- Compartilhar a validação da contagem entre CPF e CNPJ para evitar divergência.
- Rejeitar entradas de reparo acima de 64 caracteres antes de regexes e cópias.

## Alternativas

- Manter lote ilimitado e delegar a proteção ao consumidor: rejeitada porque a
  API pública transforma uma entrada numérica curta em alocação arbitrária.
- Trocar `generateMany` por iterator ou stream: rejeitada na série 3.x porque
  quebraria o contrato de retorno; geração incremental permanece uma evolução
  aditiva futura.
- Escolher um limite dependente do ambiente: rejeitada porque produziria
  comportamento imprevisível entre navegador e Node.js.

## Consequências

Chamadas existentes até 10.000 itens mantêm o comportamento. Contagens maiores
falham antes de alocar o array. O teto não é uma promessa de que 10.000 itens
sejam adequados a toda aplicação; consumidores ainda devem adotar limites de
requisição e concorrência compatíveis com seu ambiente.

# Roadmap

Este roadmap descreve direção, não uma promessa de prazo. Itens entram em uma
release somente depois de terem contrato, testes e impacto de compatibilidade
avaliados.

## Objetivos

- Manter CPF e CNPJ corretos, pequenos e previsíveis em todos os ambientes
  suportados.
- Tratar o pacote instalado — runtime, tipos e subpaths — como o produto.
- Tornar mudanças de domínio e compatibilidade rastreáveis até uma decisão e um
  teste.
- Permitir manutenção segura por pessoas que não participaram da implementação
  original.

## Não objetivos

- Consultar situação cadastral ou confirmar que um documento foi emitido.
- Gerar documentos únicos, secretos ou adequados a autenticação.
- Aceitar automaticamente toda representação permissiva de entrada.
- Criar uma abstração genérica para documentos que não fazem parte do pacote.

## Série 2.x concluída

- Correções compatíveis e atualização das regras documentadas.
- Testes de propriedades determinísticos e testes do tarball publicado.
- Automação de manutenção, segurança e releases reproduzíveis.
- Depreciações acompanhadas de substituição e documentação.

## Entregue na 3.0: CNPJ alfanumérico

A Receita Federal iniciou novas inscrições alfanuméricas em julho de 2026. A API
2.x é deliberadamente numérica: `calc` recebe números, `parse` devolve números e
`repair` reserva `X` como marcador. Aceitar letras em apenas algumas funções
criaria uma falsa compatibilidade.

A 3.0 trata o ciclo completo — tipos, cálculo, validação, formatação, parsing,
geração e reparo — mantendo CNPJs numéricos existentes e a geração numérica como
padrão. Consulte `docs/adr/006-alphanumeric-cnpj.md`.

## Candidatos futuros

- Separar geração unitária, geração em lote e geração incremental.
- Substituir o booleano `strict` por modos de entrada explícitos.
- Remover entrada numérica, truncamento implícito e aliases depreciados.
- Introduzir erros tipados e limites operacionais documentados.

Esses candidatos precisam de proposta própria. A lista não autoriza outra quebra
de compatibilidade sem ADR, guia de migração e release major.

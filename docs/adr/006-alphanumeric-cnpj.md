# ADR 006: adaptar CNPJ alfanumérico de forma coerente na 3.x

- Status: implementado na 3.0.0
- Data da decisão: 2026-08-08

## Contexto

A Receita Federal iniciou em julho de 2026 a implantação progressiva de CNPJ com
12 posições alfanuméricas e dois verificadores numéricos. Os formatos numérico e
alfanumérico coexistem e devem ser aceitos em todos os processos.

A API 2.x contém premissas incompatíveis com uma extensão superficial:

- `calc` recebe `number[]`;
- `parse` expõe partes como `number[]`;
- o núcleo representa o corpo como números de 0 a 9;
- `repair` usa `X`, agora um caractere válido, como posição desconhecida;
- `generate` não permite escolher a família do identificador.

## Decisão

Implementar o suporte completo na 3.0.0 e preservar o caminho numérico existente:

- cálculo aceita string ou array sem destruir a representação das letras;
- parsing retorna campos semânticos sempre em strings, preservando letras e zeros
  à esquerda;
- geração permanece numérica por padrão e recebe um `kind` explícito;
- reparo adota `?` e trata `X` como dado no corpo;
- entrada estrita segue `A-Z`; entrada permissiva normaliza minúsculas;
- vetores oficiais protegem o cálculo e a validação.

## Alternativas

- Aceitar letras apenas em `isValid`: rejeitada porque as demais operações
  continuariam incompatíveis sob a mesma API.
- Converter letras em números no resultado de `parse`: rejeitada porque perde a
  representação original e surpreende consumidores.
- Continuar apresentando a biblioteca como suporte geral a CNPJ: rejeitada porque
  produz uma garantia incorreta após a mudança normativa.

## Consequências

A mudança exige versão major porque substitui a representação numérica anterior
de `parse`, amplia as entradas de cálculo e altera a semântica de letras no modo
permissivo e de `X` no reparo. Consumidores numéricos que não dependem desses
comportamentos mantêm o mesmo fluxo.

## Fontes

- [Programa CNPJ Alfanumérico](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
- [Manual de cálculo do DV](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf)
- [Instrução Normativa compilada](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=127567&naoPublicado=&visao=compilado)

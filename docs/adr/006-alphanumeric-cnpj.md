# ADR 006: adaptar CNPJ alfanumérico de forma coerente na 3.x

- Status: aceito como direção; desenho da API pendente
- Data da decisão: 2026-08-08

## Contexto

A Receita Federal iniciou em julho de 2026 a implantação de novas inscrições de
CNPJ com 12 posições alfanuméricas e dois verificadores numéricos. CNPJs numéricos
existentes permanecem válidos.

A API 2.x contém premissas incompatíveis com uma extensão superficial:

- `calc` recebe `number[]`;
- `parse` expõe partes como `number[]`;
- o núcleo representa o corpo como números de 0 a 9;
- `repair` usa `X`, agora um caractere válido, como posição desconhecida;
- `generate` não permite escolher a família do identificador.

## Decisão

Manter a série 2.x explicitamente limitada a CNPJ numérico e implementar suporte
alfanumérico completo em uma versão major. A proposta deve cobrir todas as funções
e preservar validação dos números existentes. Documentação e metadata devem
declarar a limitação enquanto a major não existir.

## Alternativas

- Aceitar letras apenas em `validate`: rejeitada porque as demais operações
  continuariam incompatíveis sob a mesma API.
- Converter letras em números no resultado de `parse`: rejeitada porque perde a
  representação original e surpreende consumidores.
- Continuar apresentando a biblioteca como suporte geral a CNPJ: rejeitada porque
  produz uma garantia incorreta após a mudança normativa.

## Consequências

A 2.x continua útil para cadastros numéricos, mas retorna falso para inscrições
alfanuméricas. A 3.x precisa de guia de migração, vetores oficiais, validação
diferencial contra o simulador e decisão explícita sobre o marcador de reparo.

## Fontes

- [Programa CNPJ Alfanumérico](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
- [Manual de cálculo do DV](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf)
- [Instrução Normativa compilada](https://normas.receita.fazenda.gov.br/sijut2consulta/link.action?idAto=127567&naoPublicado=&visao=compilado)

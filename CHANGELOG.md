# Changelog

Alterações relevantes para consumidores são registradas neste arquivo. O formato
segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## 3.0.0 - 2026-08-08

### Adicionado

- Política de suporte, segurança e contribuição.
- Especificação das regras de domínio e registros de decisão arquitetural.
- Testes determinísticos baseados em propriedades para o núcleo compartilhado.
- Cobertura mínima de 100% para linhas, statements, funções e branches.
- Suporte completo à coexistência de CNPJ numérico e alfanumérico em validação,
  formato, parsing, cálculo, geração e reparo.
- Tipos `CnpjBody`, `CnpjCharacter`, `CnpjMode` e `CnpjRepairOptions`.
- Vetores oficiais da Receita Federal e testes determinísticos dos dois formatos.

### Alterado

- `cnpj.calc` aceita string ou array contendo números e letras maiúsculas.
- `cnpj.parse` preserva letras do corpo em vez de descartá-las.
- `cnpj.generate` aceita `mode: 'numeric' | 'alphanumeric'`; o padrão continua
  numérico.
- `cnpj.repair` adota `?` como marcador padrão; `X` no corpo é dado válido.
- No modo não estrito, letras são preservadas e normalizadas para maiúsculas.
- Testes probabilísticos de geração foram substituídos por invariantes
  reproduzíveis.

### Compatibilidade

- Esta é uma versão major porque tipos e semântica de parsing, normalização e
  reparo de CNPJ mudaram. Consulte `docs/migration-v3.md`.

## 2.0.1 - 2019-01-04

- Release pública anterior da série 2.x.

Releases históricas anteriores a esta adoção de changelog permanecem disponíveis
no histórico Git e no registro do npm.

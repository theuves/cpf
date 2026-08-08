# Changelog

Alterações relevantes para consumidores são registradas neste arquivo. O formato
segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## Não lançado

### Segurança

- `generateMany` agora rejeita contagens acima de 10.000 para impedir
  esgotamento de memória por alocação síncrona de lotes sem limite.
- A busca de reparos de CPF rejeita entradas excessivamente longas antes de
  executar expressões regulares e normalização, alinhada ao limite do CNPJ.

### Adicionado

- `cpf.inspect` e `cnpj.inspect`, com resultado discriminado e códigos estáveis
  para diagnosticar entradas inválidas.
- `cnpj.getKind` para classificar estruturas completas como numéricas ou
  alfanuméricas sem atestar os dígitos verificadores.
- Tipos públicos `DocumentIssueCode`, `CpfInspectionResult` e
  `CnpjInspectionResult`.
- Tipos de opções e valores semânticos para formato e geração nos exports raiz e
  subpaths.
- `CpfIssueCode`, que exclui o diagnóstico exclusivo dos verificadores de CNPJ,
  e tipos de caracteres ASCII aceitos em arrays de CNPJ.

### Alterado

- A tipagem de `cpf.inspect` não inclui mais
  `INVALID_VERIFIER_CHARACTERS`, resultado impossível nesse domínio.
- `generate` e `generateMany` compartilham o mesmo tipo público de opções.

## 3.0.0 - 2026-08-08

### Adicionado

- Política de suporte, segurança e contribuição.
- Especificação das regras de domínio e registros de decisão arquitetural.
- Testes determinísticos baseados em propriedades para o núcleo compartilhado.
- Cobertura mínima de 100% para linhas, statements, funções e branches.
- Suporte completo à coexistência de CNPJ numérico e alfanumérico em validação,
  formato, parsing, cálculo, geração e reparo.
- Tipos `CnpjBody`, `CnpjKind` e `RepairOptions`.
- Vetores oficiais da Receita Federal e testes determinísticos dos dois formatos.
- API semântica: `isValid`, `matchesFormat`, `normalize`,
  `calculateCheckDigits`, `findValidRepairs`, `generateMany` e, para CPF,
  `getFiscalRegions`.
- Opções de geração: `validity`, `output`, `kind` e `randomSource`.

### Alterado

- `calculateCheckDigits` aceita corpo CNPJ em string ou array contendo números e
  letras maiúsculas.
- `parse` agora exige valor completo e devolve campos semânticos em strings.
- `generate` sempre retorna uma string; `generateMany` cria lotes.
- A geração de CNPJ recebe `kind: 'numeric' | 'alphanumeric'`; o padrão continua
  numérico.
- `findValidRepairs` adota `?` como marcador padrão; `X` no corpo é dado válido.
- `normalize` converte letras CNPJ a maiúsculas sem truncar valores inválidos.
- Testes probabilísticos de geração foram substituídos por invariantes
  reproduzíveis.

### Compatibilidade

- Esta é uma versão major porque tipos e semântica de parsing, normalização e
  reparo de CNPJ mudaram e a API legada foi removida. Consulte
  `docs/migration-v3.md`.

## 2.0.1 - 2019-01-04

- Release pública anterior da série 2.x.

Releases históricas anteriores a esta adoção de changelog permanecem disponíveis
no histórico Git e no registro do npm.

# Documentação pública e descoberta

O site da biblioteca é publicado em <https://theuves.github.io/cpf/> pelo
workflow `Documentation`. Os guias são escritos em `docs/guides`; títulos,
descrições e navegação ficam em `website/pages.json`. A referência da API é
extraída do README para evitar manter duas cópias do contrato.
A ordem em `website/pages.json` também define a paginação da documentação:
links anterior/próxima, números e indicador da página atual.

## Idiomas

Português mantém as URLs originais. A versão inglesa fica em `/en/`, com os
quatro guias e a referência em `docs/en`. Cada entrada de `website/pages.json`
tem os metadados portugueses e sua tradução em `en`; mantenha os dois conteúdos
atualizados ao mudar a API. A referência portuguesa continua extraída do README;
a inglesa é mantida em `docs/en/api.md`.

Os textos da interface ficam em `website/i18n.mjs` e as mensagens da demonstração
em `website/demo-messages.mjs`. O seletor usa links estáticos para a página
equivalente, sem redirecionamento automático nem dependência de JavaScript.
Cada página tem URL canônica própria e alternativas `hreflang` recíprocas. O
sitemap inclui as 12 páginas. `test:docs` verifica traduções, alternância de
idioma, paginação, links e exemplos de código nos dois idiomas.

## Verificação local

```sh
npm run build:docs
npm run test:docs
```

O resultado fica em `site-dist`, ignorado pelo Git e excluído do pacote npm.
O build inclui o código real da biblioteca na demonstração e gera HTML estático,
URLs canônicas, metadados sociais e `sitemap.xml`. O parser Markdown é apenas uma
dependência de desenvolvimento; não acompanha o runtime da biblioteca.
Os blocos de código recebem realce com Shiki e os temas GitHub Light e GitHub Dark durante o
build, inclusive na página inicial. JavaScript, TypeScript, TSX, HTML, shell e
JSON são suportados; outras linguagens ficam em texto simples. Nenhum código
do realçador é enviado ao navegador ou incluído no pacote publicado.
Os ícones da interface usam Lucide Static: somente os SVGs utilizados entram no
HTML, gerados pela função `icon` no build. Mantenha textos visíveis nos controles;
os SVGs são decorativos e ficam ocultos de leitores de tela. Os arquivos JS e CSS
usam uma versão derivada do conteúdo na URL para evitar assets antigos em cache.

O botão de tema está presente em todas as páginas. `website/theme.js` aplica o
tema antes do CSS para evitar um clarão ao abrir uma página escura. Sem uma
escolha salva, acompanha `prefers-color-scheme`; a escolha manual fica em
`localStorage` (`cpf-theme`) e é compartilhada entre páginas, idiomas e abas.
Se o armazenamento estiver bloqueado, o botão continua funcionando na página.
As cores dos dois temas ficam nas variáveis de `website/styles.css`.
`test:docs` também verifica o comportamento do tema com e sem armazenamento.

`SITE_URL` controla a URL pública e o prefixo de caminhos. Para testar com um
servidor local na raiz, use `SITE_URL=http://localhost:8000/` nos dois comandos
e sirva `site-dist`. O workflow fixa a URL pública HTTPS para manter as URLs
canônicas e o sitemap consistentes, mesmo quando a API do Pages informa HTTP.

## Publicação

O repositório deve ter GitHub Pages configurado para GitHub Actions. Pull requests
compilam e verificam o site; somente a branch `master` publica. O workflow também
pode ser executado manualmente. Atualizar README ou `package.json` no GitHub não
atualiza o pacote já publicado: os metadados npm seguem o processo em
[releasing.md](releasing.md).

## Search Console e acompanhamento

O site não instala analytics de terceiros e não registra os documentos digitados.
Acompanhe descoberta pelo Search Console após verificar a propriedade:

1. Adicione a propriedade de prefixo de URL `https://theuves.github.io/cpf/` na
   conta Google responsável pelo projeto.
2. Escolha a verificação por tag HTML e copie somente o valor de `content`.
3. Cadastre esse valor na variável de Actions `SEARCH_CONSOLE_VERIFICATION` e
   execute novamente o workflow `Documentation`.
4. Confirme a verificação e envie `https://theuves.github.io/cpf/sitemap.xml`.
5. Registre uma linha de base de impressões, cliques, consultas e páginas; compare
   períodos equivalentes conforme os dados forem aparecendo.

A tag só é emitida quando a variável está definida. Publicar o site não verifica
a propriedade nem garante indexação. Consulte o
[guia do Google para desenvolvedores](https://developers.google.com/search/docs/fundamentals/get-started-developers).

Use também os relatórios de tráfego e referências do GitHub e a evolução dos
downloads do npm. Downloads incluem automações e não representam pessoas únicas.
Cliques de saída para GitHub/npm não são medidos por esta implementação; isso
exigiria definir e conectar uma ferramenta de analytics.

## Manutenção de conteúdo

A interface toma como referência a ferramenta Fargate da Fidalgo: cabeçalho
compacto, fundo claro, entrada e resultado lado a lado e documentação acessível.
A assinatura da Fidalgo aparece no cabeçalho e rodapé, sem chamadas comerciais.
A paleta usa azul-marinho `#102b46`, azul-claro `#7c9cff` e fonte Arial. Os estilos ficam em
`website/styles.css`; `website/fidalgo.svg` é o símbolo da Fidalgo, copiado dos
assets oficiais da marca. O site serve todos os assets localmente.

Priorize exemplos úteis e compatíveis com a API publicada. Atualize os guias quando
o comportamento mudar, confira os links oficiais e preserve a distinção entre
validação matemática e consulta cadastral. Não publique páginas repetidas apenas
para cobrir variações de palavras-chave.

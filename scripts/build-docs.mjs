import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'
import MarkdownIt from 'markdown-it'
import { build } from 'esbuild'
import { createHighlighter } from 'shiki'

const siteUrl = new URL(
  process.env.SITE_URL || 'https://theuves.github.io/cpf/'
)
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'
const base = siteUrl.pathname
const output = resolve('site-dist')
const repository = 'https://github.com/theuves/cpf'
const pages = JSON.parse(await readFile('website/pages.json', 'utf8'))
const styles = await readFile('website/styles.css')
const stylesVersion = createHash('sha256')
  .update(styles)
  .digest('hex')
  .slice(0, 12)
const highlighter = await createHighlighter({
  themes: ['github-light'],
  langs: ['javascript', 'typescript', 'tsx', 'html', 'bash', 'json'],
})
const languages = new Set(highlighter.getLoadedLanguages())
function highlight(code, language) {
  const lang = language.trim().split(/\s+/)[0]
  return highlighter.codeToHtml(code, {
    lang: languages.has(lang) ? lang : 'text',
    theme: 'github-light',
  })
}
const md = new MarkdownIt({ highlight })
const escape = md.utils.escapeHtml
const sourcePages = new Map(
  pages.map(page => [resolve(page.source), page.slug])
)
const originalLink = md.renderer.rules.link_open

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index]
  const href = token.attrGet('href')
  if (href && !/^(?:[a-z]+:|#|\/)/i.test(href)) {
    const [file, fragment] = href.split('#')
    const source = resolve(dirname(env.source), file)
    const slug = sourcePages.get(source)
    token.attrSet(
      'href',
      slug
        ? `${base}${slug}/${fragment ? `#${fragment}` : ''}`
        : `${repository}/blob/master/${file}`
    )
  }
  return originalLink
    ? originalLink(tokens, index, options, env, self)
    : self.renderToken(tokens, index, options)
}

md.renderer.rules.heading_open = (tokens, index, options, env, self) => {
  const title = tokens[index + 1].content
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
  tokens[index].attrSet('id', slug)
  return self.renderToken(tokens, index, options)
}

function pagination(slug) {
  const index = pages.findIndex(page => page.slug === slug)
  const adjacent = (page, direction) =>
    page
      ? `<a class="page-${direction}" href="${base}${page.slug}/" rel="${direction}"><span>${direction === 'prev' ? '← Anterior' : 'Próxima →'}</span><strong>${escape(page.label)}</strong></a>`
      : ''
  return `<nav class="pagination" aria-label="Paginação da documentação">
    <div class="page-adjacent">${adjacent(pages[index - 1], 'prev')}${adjacent(pages[index + 1], 'next')}</div>
    <ol class="page-numbers">${pages.map((page, i) => `<li><a href="${base}${page.slug}/" aria-label="Página ${i + 1}: ${escape(page.label)}"${i === index ? ' aria-current="page"' : ''}>${i + 1}</a></li>`).join('')}</ol>
    <p class="note">Página ${index + 1} de ${pages.length}</p>
  </nav>`
}

function layout({ title, description, slug = '', body, home = false }) {
  const canonical = new URL(slug ? `${slug}/` : '', siteUrl).href
  const verification = process.env.SEARCH_CONSOLE_VERIFICATION
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | cpf</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${escape(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${escape(canonical)}">
  <meta name="theme-color" content="#102b46">
  ${verification ? `<meta name="google-site-verification" content="${escape(verification)}">` : ''}
  <link rel="stylesheet" href="${base}assets/styles.css?v=${stylesVersion}">
  ${home ? `<script type="module" src="${base}assets/demo.js"></script>` : ''}
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <header class="header"><div class="header-inner">
    <div class="brand-group"><a class="brand-symbol" href="${base}" aria-label="CPF/CNPJ, início"><img src="${base}assets/fidalgo.svg" width="38" height="38" alt=""></a><div><a class="brand" href="${base}">CPF/CNPJ</a><a class="fidalgo-brand" href="https://www.fidalgoitsolutions.com.br/">por Fidalgo IT Solutions</a></div></div>
    <nav aria-label="Navegação principal">
      <a href="${base}${pages[0].slug}/">Documentação</a>
      <a href="${base}api/">API</a>
      <a href="${repository}">GitHub</a>
      <a href="https://www.npmjs.com/package/cpf">npm ↗</a>
    </nav>
  </div></header>
  <main id="conteudo" class="${home ? 'home' : 'docs'}">
  ${home ? body : `<nav class="sidebar" aria-label="Guias"><a class="back-link" href="${base}">← Experimentar a biblioteca</a><p class="eyebrow">Documentação</p>${pages.map((page, i) => `<a href="${base}${page.slug}/"${page.slug === slug ? ' aria-current="page"' : ''}><span class="sidebar-number">0${i + 1}</span>${escape(page.label)}</a>`).join('')}</nav><article class="article"><p class="eyebrow">Documentação / ${pages.findIndex(page => page.slug === slug) + 1} de ${pages.length}</p>${body}${pagination(slug)}<div class="article-end"><a href="${base}">← Voltar ao início</a> · <a href="${repository}/issues">Relatar um problema</a></div></article>`}
  </main>
  <footer><div><a class="footer-brand" href="https://www.fidalgoitsolutions.com.br/"><img src="${base}assets/fidalgo.svg" width="26" height="26" alt="">Fidalgo IT Solutions</a><span>Uma biblioteca de código aberto por <a href="https://github.com/theuves">Matheus Alves</a>.</span></div><nav aria-label="Links do projeto"><a href="${repository}/blob/master/LICENSE">Licença MIT</a><a href="${repository}/issues">Reportar problema</a><a href="${repository}">GitHub ↗</a></nav></footer>
</body>
</html>
`
}

await rm(output, { recursive: true, force: true })
await mkdir(`${output}/assets`, { recursive: true })
await copyFile('website/styles.css', `${output}/assets/styles.css`)
await copyFile('website/fidalgo.svg', `${output}/assets/fidalgo.svg`)
await build({
  entryPoints: ['website/demo.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2020',
  outfile: `${output}/assets/demo.js`,
})

const exampleCode = `import cpf, { cnpj } from 'cpf'

cpf.isValid('529.982.247-25')
// true

cnpj.isValid('12.ABC.345/01DE-35')
// true

cpf.format('5299822')
// '529.982.2'`

const homeBody = `
<section class="intro" aria-labelledby="intro-title">
  <h1 id="intro-title">CPF e CNPJ em JavaScript e TypeScript</h1>
  <p>Valide, formate e gere documentos com a biblioteca <code>cpf</code>. Suporte a CNPJ alfanumérico, tipos incluídos e zero dependências de runtime.</p>
</section>
<nav class="section-nav" aria-label="Nesta página"><a class="section-current" href="#demo-title">Experimentar</a><a href="#instalacao">Instalação e uso</a><a href="#guias">Guias</a></nav>
<section class="demo" aria-labelledby="demo-title">
  <div class="demo-grid">
    <div class="configuration">
      <p class="eyebrow">01 / Entrada</p><h2 id="demo-title">Validar e formatar</h2>
      <p class="field-group">Documento brasileiro</p>
      <label for="document-kind">Tipo de documento</label><select id="document-kind"><option value="cpf">CPF</option><option value="cnpj">CNPJ numérico ou alfanumérico</option></select>
      <label for="document-input">Documento</label><input id="document-input" type="text" inputmode="numeric" spellcheck="false" autocapitalize="characters" autocomplete="off" maxlength="64" placeholder="Digite com ou sem pontuação" aria-describedby="input-help validation-status">
      <p id="input-help" class="note">A validação usa a entrada original normalizada. A máscara é uma prévia de formatação.</p>
      <button id="load-example" type="button">Carregar exemplo <span aria-hidden="true">↗</span></button>
      <p class="local-note"><span aria-hidden="true">◉</span> Processamento local. Nenhum documento é enviado.</p>
      <noscript>Ative JavaScript para usar a demonstração. Os guias e a referência da API continuam disponíveis.</noscript>
    </div>
    <section class="result" aria-labelledby="result-title">
      <p class="eyebrow">02 / Saída</p><h2 id="result-title">Resultado</h2>
      <div class="result-preview"><dl><dt>Prévia com máscara</dt><dd id="formatted-value">—</dd></dl><p>Saída de <code>format</code></p></div>
      <dl class="normalized-result"><dt>Valor normalizado</dt><dd id="normalized-value">—</dd></dl>
      <p id="validation-status" class="status" role="status">Digite um documento ou carregue um exemplo.</p>
      <p class="result-note">A validação verifica estrutura e dígitos verificadores. Não consulta emissão, titularidade ou situação cadastral.</p>
    </section>
  </div>
</section>
<section class="quickstart" aria-labelledby="instalacao">
  <div class="quickstart-intro"><p class="eyebrow">No seu projeto</p><h2 id="instalacao">Instalação e uso</h2><p>Disponível para Node.js e navegador, com exports ESM e CommonJS.</p><div class="install">${highlight('npm install cpf', 'sh')}</div><a href="${base}api/">Consultar a referência da API →</a></div>
  <div class="code-panel"><div class="code-label"><span>exemplo.ts</span><span>JavaScript / TypeScript</span></div>${highlight(exampleCode, 'ts')}</div>
</section>
<section class="guides-section" aria-labelledby="guias">
  <div class="section-top"><div><p class="eyebrow">Documentação</p><h2 id="guias">Guias de implementação</h2></div><a href="${base}${pages[0].slug}/">Ler a documentação →</a></div>
  <div class="guide-grid">${pages
    .slice(0, 4)
    .map(
      (page, i) =>
        `<a class="guide" href="${base}${page.slug}/"><span class="guide-number">0${i + 1}</span><div><h3>${escape(page.label)} <span aria-hidden="true">↗</span></h3><p>${escape(page.description)}</p></div></a>`
    )
    .join('')}</div>
</section>`

await writeFile(
  `${output}/index.html`,
  layout({
    title: 'Validação de CPF e CNPJ em JavaScript e TypeScript',
    description:
      'Valide e formate CPF e CNPJ numérico ou alfanumérico com a biblioteca cpf. Guias, exemplos React e demonstração local, sem dependências de runtime.',
    body: homeBody,
    home: true,
  })
)

for (const page of pages) {
  let source = await readFile(page.source, 'utf8')
  if (page.slug === 'api') {
    source =
      '# Referência da API de CPF e CNPJ\n\n' +
      source.split('## API\n')[1].split('## Migração da versão 2.x')[0]
  }
  const body = md.render(source, { source: page.source })
  await mkdir(`${output}/${page.slug}`, { recursive: true })
  await writeFile(
    `${output}/${page.slug}/index.html`,
    layout({ ...page, body })
  )
}

const urls = ['', ...pages.map(page => `${page.slug}/`)]
await writeFile(
  `${output}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${escape(new URL(path, siteUrl).href)}</loc></url>`).join('')}</urlset>\n`
)
await writeFile(`${output}/.nojekyll`, '')
highlighter.dispose()
process.stdout.write(
  `Built ${urls.length} documentation pages for ${siteUrl.href}\n`
)

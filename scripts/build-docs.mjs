import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'
import MarkdownIt from 'markdown-it'
import { build } from 'esbuild'

const siteUrl = new URL(
  process.env.SITE_URL || 'https://theuves.github.io/cpf/'
)
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'
const base = siteUrl.pathname
const output = resolve('site-dist')
const repository = 'https://github.com/theuves/cpf'
const pages = JSON.parse(await readFile('website/pages.json', 'utf8'))
const md = new MarkdownIt()
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
  <link rel="stylesheet" href="${base}assets/styles.css">
  ${home ? `<script type="module" src="${base}assets/demo.js"></script>` : ''}
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <header class="header">
    <div class="brand-group"><a class="brand" href="${base}" aria-label="cpf, início">cpf</a><a class="fidalgo-brand" href="https://www.fidalgoitsolutions.com.br/" aria-label="Fidalgo IT Solutions"><img src="${base}assets/fidalgo.svg" width="32" height="32" alt=""><span>Fidalgo IT Solutions</span></a></div>
    <nav aria-label="Navegação principal">
      <a href="${base}${pages[0].slug}/">Documentação</a>
      <a href="${base}api/">API</a>
      <a href="${repository}">GitHub</a>
      <a href="https://www.npmjs.com/package/cpf">npm ↗</a>
    </nav>
  </header>
  <main id="conteudo" class="${home ? 'home' : 'docs'}">
  ${home ? body : `<nav class="sidebar" aria-label="Guias"><p class="eyebrow">Documentação</p>${pages.map(page => `<a href="${base}${page.slug}/"${page.slug === slug ? ' aria-current="page"' : ''}>${escape(page.label)}</a>`).join('')}</nav><article class="article">${body}${pagination(slug)}<div class="article-end"><a href="${base}">← Voltar ao início</a> · <a href="${repository}/issues">Relatar um problema</a></div></article>`}
  </main>
  <footer><div><a class="fidalgo-brand" href="https://www.fidalgoitsolutions.com.br/"><img src="${base}assets/fidalgo.svg" width="32" height="32" alt=""><span>Fidalgo IT Solutions</span></a><p>IA, software e cloud para empresas.</p></div><span>cpf · Licença MIT<br>Por <a href="https://github.com/theuves">Matheus Alves</a>, fundador da Fidalgo IT Solutions<br><a href="${repository}">Código aberto</a></span></footer>
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

const homeBody = `
<div class="hero-shell"><section class="hero">
  <div>
    <p class="eyebrow">Código aberto · JavaScript & TypeScript</p>
    <h1>CPF e CNPJ.<br>Do campo<br>ao <span>código.</span></h1>
    <p class="lede">Valide, formate e gere CPF e CNPJ em JavaScript e TypeScript. Com suporte a CNPJ alfanumérico e zero dependências de runtime.</p>
    <div class="hero-actions"><a class="button" href="${base}validar-cpf-javascript/">Começar a usar <span aria-hidden="true">→</span></a><a class="button button-outline" href="${base}api/">Explorar a API</a></div>
    <div class="install"><span aria-hidden="true">$</span> <code>npm install cpf</code></div>
  </div>
  <div class="code-panel"><div class="code-label"><span class="code-dots" aria-hidden="true">● ● ●</span> exemplo.ts <span>TypeScript</span></div><pre><code><span class="token-keyword">import</span> cpf, { cnpj } <span class="token-keyword">from</span> <span class="token-string">'cpf'</span>

cpf.isValid(<span class="token-string">'529.982.247-25'</span>)
<span class="token-comment">// true</span>

cnpj.isValid(<span class="token-string">'12.ABC.345/01DE-35'</span>)
<span class="token-comment">// true</span>

cpf.format(<span class="token-string">'5299822'</span>)
<span class="token-comment">// '529.982.2'</span></code></pre><div class="code-foot">Uma biblioteca. Dois documentos. Zero dependências.</div></div>
</section></div>
<div class="features"><span>CPF + CNPJ alfanumérico</span><span>Tipos incluídos</span><span>Node.js + navegador</span><span>ESM + CommonJS</span></div>
<section class="guides-section" aria-labelledby="guias">
  <p class="eyebrow">Guias de implementação</p>
  <div class="section-top"><h2 id="guias">Da dúvida à implementação.</h2><p class="note">Exemplos prontos para adaptar ao seu projeto.</p></div>
  <div class="guide-grid">${pages
    .slice(0, 4)
    .map(
      (page, i) =>
        `<a class="guide" href="${base}${page.slug}/"><span class="guide-number">0${i + 1} ↗</span><h3>${escape(page.title)}</h3><p>${escape(page.description)}</p></a>`
    )
    .join('')}</div>
</section>
<section class="demo" aria-labelledby="demo-title">
  <p class="eyebrow">Da documentação à prática</p>
  <h2 id="demo-title">Experimente no navegador.</h2>
  <p class="note">O documento é processado apenas nesta página, sem envio a um servidor. A máscara é uma prévia; a validação usa a entrada original normalizada.</p>
  <noscript>Ative JavaScript para usar a demonstração. Os guias e a referência da API continuam disponíveis.</noscript>
  <div class="demo-grid">
    <div><label for="document-kind">Tipo de documento</label><select id="document-kind"><option value="cpf">CPF</option><option value="cnpj">CNPJ numérico ou alfanumérico</option></select>
      <label for="document-input">Documento</label><input id="document-input" type="text" inputmode="numeric" spellcheck="false" autocapitalize="characters" autocomplete="off" maxlength="64" aria-describedby="validation-status">
      <button id="load-example" type="button">Carregar exemplo</button>
    </div>
    <div class="result"><dl><dt>Prévia com máscara</dt><dd id="formatted-value">—</dd><dt>Valor normalizado</dt><dd id="normalized-value">—</dd></dl><p id="validation-status" class="status" role="status">Digite um documento ou carregue um exemplo.</p></div>
  </div>
  <p class="note">A validação confirma estrutura e dígitos verificadores. Não confirma emissão, identidade, titularidade ou situação cadastral.</p>
</section>
<section class="about-fidalgo" aria-labelledby="fidalgo-title">
  <div><p class="eyebrow">Quem está por trás</p><h2 id="fidalgo-title">Tecnologia com a Fidalgo IT Solutions.</h2><p>A biblioteca cpf é desenvolvida por Matheus Alves, fundador da Fidalgo IT Solutions. Conheça o trabalho da empresa com inteligência artificial, desenvolvimento de software e cloud.</p></div>
  <a class="button" href="https://www.fidalgoitsolutions.com.br/">Conheça a Fidalgo <span aria-hidden="true">↗</span></a>
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
process.stdout.write(
  `Built ${urls.length} documentation pages for ${siteUrl.href}\n`
)

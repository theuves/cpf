import { mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'
import MarkdownIt from 'markdown-it'
import { build } from 'esbuild'
import { createHighlighter } from 'shiki'
import { locales, translate } from '../website/i18n.mjs'
import { demoMessages } from '../website/demo-messages.mjs'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  CircleX,
  Info,
} from 'lucide-static'

const siteUrl = new URL(
  process.env.SITE_URL || 'https://theuves.github.io/cpf/'
)
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'
const assetBase = siteUrl.pathname
const output = resolve('site-dist')
const repository = 'https://github.com/theuves/cpf'
const pageDefinitions = JSON.parse(await readFile('website/pages.json', 'utf8'))
const localizedPages = Object.fromEntries(
  Object.keys(locales).map(locale => [
    locale,
    pageDefinitions.map(({ en, ...pt }) => ({
      ...(locale === 'en' ? en : pt),
      id: pt.slug,
    })),
  ])
)
function context(locale) {
  return {
    config: locales[locale],
    pages: localizedPages[locale],
    base: assetBase + locales[locale].prefix,
    t: (key, values) => escape(translate(locale, key, values)),
  }
}
const styles = await readFile('website/styles.css')
const stylesVersion = createHash('sha256')
  .update(styles)
  .digest('hex')
  .slice(0, 12)
const languageSwitch = await readFile('website/language-switch.js')
const languageSwitchVersion = createHash('sha256')
  .update(languageSwitch)
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
function icon(svg) {
  return svg
    .trim()
    .replace('<svg', '<svg aria-hidden="true" focusable="false"')
    .replace('width="24"', 'width="16"')
    .replace('height="24"', 'height="16"')
}
const sourcePages = new Map(
  Object.entries(localizedPages).flatMap(([locale, pages]) =>
    pages.map(page => [
      resolve(page.source),
      `${assetBase}${locales[locale].prefix}${page.slug}/`,
    ])
  )
)
const originalLink = md.renderer.rules.link_open

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  const token = tokens[index]
  const href = token.attrGet('href')
  if (href && !/^(?:[a-z]+:|#|\/)/i.test(href)) {
    const [file, fragment] = href.split('#')
    const source = resolve(dirname(env.source), file)
    const route = sourcePages.get(source)
    token.attrSet(
      'href',
      route
        ? `${route}${fragment ? `#${fragment}` : ''}`
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

function pagination(slug, locale) {
  const { base, pages, t } = context(locale)
  const index = pages.findIndex(page => page.slug === slug)
  const adjacent = (page, direction) =>
    page
      ? `<a class="page-${direction}" href="${base}${page.slug}/" rel="${direction}"><span class="page-direction">${direction === 'prev' ? `${icon(ArrowLeft)} ${t('previous')}` : `${t('next')} ${icon(ArrowRight)}`}</span><strong>${escape(page.label)}</strong></a>`
      : ''
  return `<nav class="pagination" aria-label="${t('pagination')}">
    <div class="page-adjacent">${adjacent(pages[index - 1], 'prev')}${adjacent(pages[index + 1], 'next')}</div>
    <ol class="page-numbers">${pages.map((page, i) => `<li><a href="${base}${page.slug}/" aria-label="${t('page')} ${i + 1}: ${escape(page.label)}"${i === index ? ' aria-current="page"' : ''}>${i + 1}</a></li>`).join('')}</ol>
    <p class="note">${t('pageCount', { current: index + 1, total: pages.length })}</p>
  </nav>`
}

function layout(
  { title, description, slug = '', id, body, home = false },
  locale
) {
  const { config, base, pages, t } = context(locale)
  const companyUrl = `https://www.fidalgoitsolutions.com.br/${locale === 'en' ? 'en' : ''}`
  const canonical = new URL(base + (slug ? `${slug}/` : ''), siteUrl).href
  const alternate = lang => {
    const page = id && localizedPages[lang].find(page => page.id === id)
    return new URL(
      locales[lang].prefix + (page ? `${page.slug}/` : ''),
      siteUrl
    ).href
  }
  const verification = process.env.SEARCH_CONSOLE_VERIFICATION
  return `<!doctype html>
<html lang="${config.language}">
<head>
  <!-- Lucide icons: copyright Lucide contributors and Cole Bemis. ISC/MIT notices: ${assetBase}assets/lucide-LICENSE.txt -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | cpf</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${escape(canonical)}">
  ${Object.keys(locales)
    .map(
      lang =>
        `<link rel="alternate" hreflang="${locales[lang].language}" href="${escape(alternate(lang))}">`
    )
    .join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${escape(alternate('pt'))}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${config.ogLocale}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${escape(canonical)}">
  <meta name="theme-color" content="#102b46">
  <link rel="icon" type="image/svg+xml" href="${assetBase}assets/favicon.svg">
  ${verification ? `<meta name="google-site-verification" content="${escape(verification)}">` : ''}
  <link rel="stylesheet" href="${assetBase}assets/styles.css?v=${stylesVersion}">
  <script type="module" src="${assetBase}assets/language-switch.js?v=${languageSwitchVersion}"></script>
  ${home ? `<script type="module" src="${assetBase}assets/demo.js?v=${demoVersion}"></script>` : ''}
</head>
<body>
  <a class="skip" href="#conteudo">${t('skip')}</a>
  <header class="header"><div class="header-inner">
    <div class="brand-group"><a class="brand-symbol" href="${base}" aria-label="CPF/CNPJ, ${t('home')}"><img src="${assetBase}assets/fidalgo.svg" width="38" height="38" alt=""></a><div><a class="brand" href="${base}">CPF/CNPJ</a><a class="fidalgo-brand" href="https://www.fidalgoitsolutions.com.br/">${t('by')} Fidalgo IT Solutions</a></div></div>
    <div class="header-actions"><nav aria-label="${t('navigation')}">
      <a href="${base}${pages[0].slug}/">${t('documentation')}</a>
      <a href="${base}api/">API</a>
      <a href="${repository}">GitHub</a>
      <a href="https://www.npmjs.com/package/cpf">npm</a>
    </nav>
    <nav class="language-switch" aria-label="${t('language')}"><details>
      <summary aria-label="${config.code} ${config.name} — ${t('selectLanguage')}" aria-controls="language-options"><img class="language-flag" src="${assetBase}assets/flags/${config.flag}.svg" width="24" height="18" alt=""><span class="language-name">${config.name}</span><span class="language-code">${config.code}</span>${icon(ChevronDown)}</summary>
      <div class="language-menu" id="language-options"><p class="language-menu-title">${t('chooseLanguage')}</p>${Object.entries(
        locales
      )
        .map(
          ([lang, option]) =>
            `<a href="${escape(new URL(alternate(lang)).pathname)}" lang="${option.language}" hreflang="${option.language}" aria-label="${option.name}"${lang === locale ? ' aria-current="page"' : ''}><img class="language-flag" src="${assetBase}assets/flags/${option.flag}.svg" width="32" height="24" alt=""><span class="language-option-text"><strong>${option.name}</strong><span>${option.country}</span></span>${lang === locale ? icon(Check) : ''}</a>`
        )
        .join('')}</div></details></nav></div>
  </div></header>
  <main id="conteudo" class="${home ? 'home' : 'docs'}">
  ${home ? body : `<nav class="sidebar" aria-label="${t('guides')}"><a class="back-link" href="${base}">${icon(ArrowLeft)} ${t('tryLibrary')}</a><p class="eyebrow">${t('documentation')}</p>${pages.map((page, i) => `<a href="${base}${page.slug}/"${page.slug === slug ? ' aria-current="page"' : ''}><span class="sidebar-number">0${i + 1}</span>${escape(page.label)}</a>`).join('')}</nav><article class="article"><p class="eyebrow">${t('progress', { current: pages.findIndex(page => page.slug === slug) + 1, total: pages.length })}</p>${body}${pagination(slug, locale)}<div class="article-end"><a href="${base}">${t('back')}</a> · <a href="${repository}/issues">${t('report')}</a></div></article>`}
  </main>
  <div class="company-footer">
    <section class="company-cta" aria-labelledby="company-cta-title">
      <div><p class="eyebrow">Fidalgo IT Solutions</p><h2 id="company-cta-title">${t('ctaTitle')}</h2><p class="company-cta-description">${t('ctaDescription')}</p></div>
      <div class="company-cta-actions"><a class="company-button" href="mailto:contato@fidalgoitsolutions.com.br">${t('talkToFidalgo')} ${icon(ArrowUpRight)}</a><a class="company-button company-button-secondary" href="${companyUrl}#atuacao">${t('exploreServices')} ${icon(ArrowUpRight)}</a></div>
    </section>
    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-about"><a class="footer-brand" href="${companyUrl}"><img src="${assetBase}assets/fidalgo.svg" width="34" height="34" alt="">Fidalgo IT Solutions</a><strong>${t('companyTagline')}</strong><p>${t('companyDescription')}</p><a class="footer-email" href="mailto:contato@fidalgoitsolutions.com.br">contato@fidalgoitsolutions.com.br</a></div>
        <nav class="footer-links" aria-label="${t('projectLinks')}">
          <div><h3>${t('application')}</h3><a href="${base}">${t('tryLibrary')}</a><a href="${base}${pages[0].slug}/">${t('documentation')}</a><a href="${base}api/">API</a><a href="${repository}">${t('sourceCode')}</a><a href="${repository}/issues">${t('report')}</a></div>
          <div><h3>Fidalgo</h3><a href="${companyUrl}#atuacao">${t('services')}</a><a href="${companyUrl}${locale === 'en' ? '/' : ''}blog">Blog</a><a href="mailto:contato@fidalgoitsolutions.com.br">${t('contact')}</a></div>
          <div><h3>${t('followUs')}</h3><a href="https://linkedin.com/company/fidalgoitsolutions">LinkedIn</a><a href="https://github.com/fidalgoitsolutions">GitHub</a><a href="https://www.instagram.com/fidalgoitsolutions">Instagram</a></div>
        </nav>
      </div>
      <div class="footer-bottom"><p>© ${new Date().getUTCFullYear()} Fidalgo IT Solutions. ${t('companyRights')}</p><div class="footer-company-details"><span>Fidalgo Tecnologia da Informacao LTDA</span><span>Belo Horizonte - MG</span><span>CNPJ 49.627.083/0001-32</span></div><p>${t('credit')} <a href="https://github.com/theuves">Matheus Alves</a>. <a href="${repository}/blob/master/LICENSE">${t('license')}</a>.</p></div>
    </footer>
  </div>
</body>
</html>
`
}

await rm(output, { recursive: true, force: true })
await mkdir(`${output}/assets`, { recursive: true })
await copyFile('website/styles.css', `${output}/assets/styles.css`)
await copyFile('website/fidalgo.svg', `${output}/assets/fidalgo.svg`)
await copyFile('website/favicon.svg', `${output}/assets/favicon.svg`)
await copyFile(
  'website/language-switch.js',
  `${output}/assets/language-switch.js`
)
await mkdir(`${output}/assets/flags`, { recursive: true })
for (const flag of ['br', 'us'])
  await copyFile(
    `website/flags/${flag}.svg`,
    `${output}/assets/flags/${flag}.svg`
  )
await copyFile(
  'node_modules/lucide-static/LICENSE',
  `${output}/assets/lucide-LICENSE.txt`
)
await build({
  entryPoints: ['website/demo.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2020',
  outfile: `${output}/assets/demo.js`,
})
const demoVersion = createHash('sha256')
  .update(await readFile(`${output}/assets/demo.js`))
  .digest('hex')
  .slice(0, 12)

const exampleCode = `import cpf, { cnpj } from 'cpf'

cpf.isValid('529.982.247-25')
// true

cnpj.isValid('12.ABC.345/01DE-35')
// true

cpf.format('5299822')
// '529.982.2'`

function renderHome(locale) {
  const { base, pages, t } = context(locale)
  return `
<section class="intro" aria-labelledby="intro-title">
  <h1 id="intro-title">${t('introTitle')}</h1>
  <p>${t('introBefore')} <code>cpf</code>${locale === 'pt' ? '. ' : ' '}${t('introAfter')}</p>
</section>
<nav class="section-nav" aria-label="${t('onPage')}"><a class="section-current" href="#demo-title">${t('try')}</a><a href="#instalacao">${t('installation')}</a><a href="#guias">${t('guides')}</a></nav>
<section class="demo" aria-labelledby="demo-title">
  <div class="demo-grid">
    <div class="configuration">
      <p class="eyebrow">${t('inputStep')}</p><h2 id="demo-title">${t('validate')}</h2>
      <p class="field-group">${t('brazilianDocument')}</p>
      <label for="document-kind">${t('documentType')}</label><select id="document-kind"><option value="cpf">CPF</option><option value="cnpj">${t('cnpjOption')}</option></select>
      <label for="document-input">${t('document')}</label><input id="document-input" type="text" inputmode="numeric" spellcheck="false" autocapitalize="characters" autocomplete="off" maxlength="64" placeholder="${t('placeholder')}" aria-describedby="input-help validation-status">
      <p id="input-help" class="note">${t('inputHelp')}</p>
      <button id="load-example" type="button">${t('loadExample')}</button>
      <p class="local-note"><span>${t('local')}</span></p>
      <noscript>${t('noscript')}</noscript>
    </div>
    <section class="result" aria-labelledby="result-title">
      <p class="eyebrow">${t('outputStep')}</p><h2 id="result-title">${t('result')}</h2>
      <div class="result-preview"><dl><dt>${t('preview')}</dt><dd id="formatted-value">—</dd></dl><p>${t('outputOf')} <code>format</code></p></div>
      <dl class="normalized-result"><dt>${t('normalized')}</dt><dd id="normalized-value">—</dd></dl>
      <p id="validation-status" class="status" role="status"><span class="status-icon status-idle">${icon(Info)}</span><span class="status-icon status-valid">${icon(CircleCheck)}</span><span class="status-icon status-invalid">${icon(CircleX)}</span><span id="validation-message">${escape(demoMessages[locale].idle)}</span></p>
      <p class="result-note">${t('limitation')}</p>
    </section>
  </div>
</section>
<section class="quickstart" aria-labelledby="instalacao">
  <div class="quickstart-intro"><p class="eyebrow">${t('inProject')}</p><h2 id="instalacao">${t('installation')}</h2><p>${t('environments')}</p><div class="install">${highlight('npm install cpf', 'sh')}</div><a href="${base}api/">${t('apiReference')} ${icon(ArrowRight)}</a></div>
  <div class="code-panel"><div class="code-label"><span>${t('exampleFile')}</span><span>JavaScript / TypeScript</span></div>${highlight(exampleCode, 'ts')}</div>
</section>
<section class="guides-section" aria-labelledby="guias">
  <div class="section-top"><div><p class="eyebrow">${t('documentation')}</p><h2 id="guias">${t('implementationGuides')}</h2></div><a href="${base}${pages[0].slug}/">${t('readDocs')} ${icon(ArrowRight)}</a></div>
  <div class="guide-grid">${pages
    .slice(0, 4)
    .map(
      (page, i) =>
        `<a class="guide" href="${base}${page.slug}/"><span class="guide-number">0${i + 1}</span><div><h3>${escape(page.label)}</h3><p>${escape(page.description)}</p></div></a>`
    )
    .join('')}</div>
</section>`
}

const urls = []
for (const locale of Object.keys(locales)) {
  const { config, pages } = context(locale)
  const directory = `${output}/${config.prefix}`
  await mkdir(directory, { recursive: true })
  await writeFile(
    `${directory}index.html`,
    layout(
      {
        title: translate(locale, 'homeTitle'),
        description: translate(locale, 'homeDescription'),
        body: renderHome(locale),
        home: true,
      },
      locale
    )
  )
  urls.push(config.prefix)
  for (const page of pages) {
    let source = await readFile(page.source, 'utf8')
    if (page.slug === 'api' && locale === 'pt') {
      source =
        '# Referência da API de CPF e CNPJ\n\n' +
        source.split('## API\n')[1].split('## Migração da versão 2.x')[0]
    }
    const body = md.render(source, { source: page.source })
    await mkdir(`${directory}${page.slug}`, { recursive: true })
    await writeFile(
      `${directory}${page.slug}/index.html`,
      layout({ ...page, body }, locale)
    )
    urls.push(`${config.prefix}${page.slug}/`)
  }
}
await writeFile(
  `${output}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(path => `<url><loc>${escape(new URL(path, siteUrl).href)}</loc></url>`).join('')}</urlset>\n`
)
await writeFile(`${output}/.nojekyll`, '')
highlighter.dispose()
process.stdout.write(
  `Built ${urls.length} documentation pages for ${siteUrl.href}\n`
)

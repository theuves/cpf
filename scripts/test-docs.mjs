import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'
import { transform } from 'esbuild'
import MarkdownIt from 'markdown-it'

const pages = JSON.parse(await readFile('website/pages.json', 'utf8'))
const siteUrl = new URL(
  process.env.SITE_URL || 'https://theuves.github.io/cpf/'
)
if (!siteUrl.pathname.endsWith('/')) siteUrl.pathname += '/'
const output = resolve('site-dist')
const paths = ['', ...pages.map(page => `${page.slug}/`)]
const titles = new Set()
const descriptions = new Set()
const sitemap = await readFile(`${output}/sitemap.xml`, 'utf8')

for (const path of paths) {
  const html = await readFile(`${output}/${path}index.html`, 'utf8')
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`)
  assert.match(html, /<html lang="pt-BR">/)
  assert(!html.includes('noindex'), `${path}: must be indexable`)
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  const description = html.match(/name="description" content="([^"]+)"/)?.[1]
  assert(title && description, `${path}: missing metadata`)
  assert(!titles.has(title), `${path}: duplicated title`)
  assert(!descriptions.has(description), `${path}: duplicated description`)
  titles.add(title)
  descriptions.add(description)
  const canonical = new URL(path, siteUrl).href
  assert(html.includes(`rel="canonical" href="${canonical}"`))
  assert(sitemap.includes(`<loc>${canonical}</loc>`))

  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(href, canonical)
    if (url.origin !== siteUrl.origin) continue
    assert(
      url.pathname.startsWith(siteUrl.pathname),
      `Outside base path: ${href}`
    )
    const relative = url.pathname.slice(siteUrl.pathname.length)
    const file = `${output}/${relative}${url.pathname.endsWith('/') ? 'index.html' : ''}`
    assert((await stat(file)).isFile(), `Missing target: ${href}`)
    if (url.hash) {
      const target = await readFile(file, 'utf8')
      assert(
        target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `Missing anchor: ${href}`
      )
    }
  }
}

const md = new MarkdownIt()
let snippets = 0
for (const page of pages.filter(page => page.slug !== 'api')) {
  const source = await readFile(page.source, 'utf8')
  for (const token of md.parse(source, {})) {
    if (token.type !== 'fence' || !['ts', 'tsx', 'js'].includes(token.info))
      continue
    await transform(token.content, { loader: token.info, target: 'es2020' })
    snippets++
  }
}
process.stdout.write(
  `Verified ${paths.length} pages: metadata, sitemap, local links, anchors and ${snippets} code snippets.\n`
)

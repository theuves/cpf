import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { URL } from 'node:url'
import { runInNewContext } from 'node:vm'

const source = await readFile(
  new URL('../website/theme.js', import.meta.url),
  'utf8'
)

function browser({ saved = null, dark = false, blocked = false } = {}) {
  const attributes = new Map()
  const documentEvents = new Map()
  const windowEvents = new Map()
  const buttonEvents = new Map()
  const mediaEvents = new Map()
  const root = { dataset: {} }
  const media = {
    matches: dark,
    addEventListener: (type, handler) => mediaEvents.set(type, handler),
  }
  const button = {
    hidden: true,
    dataset: { lightLabel: 'Use light theme', darkLabel: 'Use dark theme' },
    setAttribute: (name, value) => attributes.set(name, value),
    addEventListener: (type, handler) => buttonEvents.set(type, handler),
  }
  const color = {}
  const document = {
    documentElement: root,
    querySelector: selector => (selector === '.theme-toggle' ? button : color),
    addEventListener: (type, handler) => documentEvents.set(type, handler),
  }
  const window = {
    matchMedia: () => media,
    localStorage: {
      getItem: () => {
        if (blocked) throw new Error('Storage blocked')
        return saved
      },
      setItem: (_key, value) => {
        if (blocked) throw new Error('Storage blocked')
        saved = value
      },
    },
    addEventListener: (type, handler) => windowEvents.set(type, handler),
  }
  runInNewContext(source, { document, window })
  return {
    theme: () => root.dataset.theme,
    saved: () => saved,
    pressed: () => attributes.get('aria-pressed'),
    button,
    ready: () => documentEvents.get('DOMContentLoaded')(),
    toggle: () => buttonEvents.get('click')(),
    system: value => {
      media.matches = value
      mediaEvents.get('change')()
    },
    storage: (value, key = 'cpf-theme') =>
      windowEvents.get('storage')({ key, newValue: value }),
  }
}

for (const dark of [false, true]) {
  const page = browser({ dark })
  assert.equal(
    page.theme(),
    dark ? 'dark' : 'light',
    'Apply system theme before DOM is ready'
  )
  page.ready()
  assert.equal(page.button.hidden, false)
  assert.equal(page.pressed(), String(dark))
  page.system(!dark)
  assert.equal(
    page.theme(),
    dark ? 'light' : 'dark',
    'Follow system changes until a theme is selected'
  )
}

for (const saved of ['light', 'dark']) {
  const page = browser({ saved, dark: saved !== 'dark' })
  page.ready()
  assert.equal(
    page.theme(),
    saved,
    'Saved choice takes precedence over the system'
  )
  page.system(saved !== 'dark')
  assert.equal(page.theme(), saved)
  page.toggle()
  const chosen = saved === 'dark' ? 'light' : 'dark'
  assert.equal(page.saved(), chosen)
  assert.equal(page.pressed(), String(chosen === 'dark'))
  assert.equal(
    page.button.title,
    chosen === 'dark' ? 'Use light theme' : 'Use dark theme'
  )
  assert.equal(
    browser({ saved: page.saved() }).theme(),
    chosen,
    'Preserve choice after navigation'
  )
}

const blocked = browser({ blocked: true })
blocked.ready()
blocked.toggle()
assert.equal(blocked.theme(), 'dark', 'Toggle works without browser storage')
blocked.system(false)
assert.equal(
  blocked.theme(),
  'dark',
  'Keep the in-memory choice if storage is unavailable'
)

const synced = browser({ saved: 'invalid', dark: true })
synced.ready()
assert.equal(synced.theme(), 'dark', 'Ignore invalid preferences')
synced.storage('light')
assert.equal(synced.theme(), 'light', 'Synchronize theme across tabs')
synced.storage('dark', 'unrelated')
assert.equal(synced.theme(), 'light')
synced.storage(null, null)
assert.equal(
  synced.theme(),
  'dark',
  'Return to system theme when preferences are cleared'
)

process.stdout.write(
  'Verified theme initialization, system preference, persistence, storage fallback and cross-tab sync.\n'
)

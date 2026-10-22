;(() => {
  const storageKey = 'cpf-theme'
  const isTheme = value => value === 'light' || value === 'dark'
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
  let preference = null
  let button = null

  try {
    const saved = window.localStorage.getItem(storageKey)
    if (isTheme(saved)) preference = saved
  } catch {
    // The theme still works when browser storage is unavailable.
  }

  function applyTheme() {
    const theme = preference || (systemTheme.matches ? 'dark' : 'light')
    document.documentElement.dataset.theme = theme
    const color = document.querySelector('meta[name="theme-color"]')
    if (color) color.content = theme === 'dark' ? '#0d1520' : '#102b46'
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'dark'))
      button.title =
        theme === 'dark' ? button.dataset.lightLabel : button.dataset.darkLabel
    }
  }

  applyTheme()

  document.addEventListener('DOMContentLoaded', () => {
    button = document.querySelector('.theme-toggle')
    if (!button) return
    button.hidden = false
    applyTheme()
    button.addEventListener('click', () => {
      preference =
        document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
      applyTheme()
      try {
        window.localStorage.setItem(storageKey, preference)
      } catch {
        // Keep the selection for this page even if it cannot be saved.
      }
    })
  })

  systemTheme.addEventListener('change', () => {
    if (!preference) applyTheme()
  })

  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return
    preference = isTheme(event.newValue) ? event.newValue : null
    applyTheme()
  })
})()

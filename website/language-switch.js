const disclosure = document.querySelector('.language-switch details')

if (disclosure) {
  const trigger = disclosure.querySelector('summary')
  const options = [...disclosure.querySelectorAll('a')]
  const close = () => {
    disclosure.open = false
  }

  document.addEventListener('click', event => {
    if (!disclosure.contains(event.target)) close()
  })

  disclosure.addEventListener('focusout', event => {
    if (!disclosure.contains(event.relatedTarget)) close()
  })

  disclosure.addEventListener('keydown', event => {
    if (event.key === 'Escape' && disclosure.open) {
      event.preventDefault()
      close()
      trigger.focus()
      return
    }

    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    if (!disclosure.open && event.target !== trigger) return
    event.preventDefault()
    disclosure.open = true
    const current = options.indexOf(document.activeElement)
    const index =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? options.length - 1
          : event.key === 'ArrowDown'
            ? (current + 1) % options.length
            : current < 0
              ? options.length - 1
              : (current - 1 + options.length) % options.length
    options[index].focus()
  })
}

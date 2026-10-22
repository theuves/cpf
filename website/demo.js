import cpf, { cnpj } from '../src/index.ts'
import { demoMessages } from './demo-messages.mjs'

const input = document.querySelector('#document-input')
const kind = document.querySelector('#document-kind')
const mask = document.querySelector('#formatted-value')
const normalized = document.querySelector('#normalized-value')
const status = document.querySelector('#validation-status')
const statusMessage = document.querySelector('#validation-message')
const example = document.querySelector('#load-example')
const messages =
  demoMessages[document.documentElement.lang === 'en' ? 'en' : 'pt']

function update() {
  const api = kind.value === 'cpf' ? cpf : cnpj
  input.inputMode = kind.value === 'cpf' ? 'numeric' : 'text'
  mask.textContent = api.format(input.value, { strict: false }) || '—'
  normalized.textContent = '—'
  status.dataset.valid = ''
  if (!input.value.trim()) {
    statusMessage.textContent = messages.idle
    return
  }
  try {
    const value = api.normalize(input.value)
    normalized.textContent = value || '—'
    const result = api.inspect(value)
    status.dataset.valid = String(result.valid)
    statusMessage.textContent = result.valid
      ? messages.valid
      : messages.issues[result.issue]
  } catch {
    status.dataset.valid = 'false'
    statusMessage.textContent = messages.invalid
  }
}

input.addEventListener('input', update)
kind.addEventListener('change', update)
example.addEventListener('click', () => {
  input.value = kind.value === 'cpf' ? '529.982.247-25' : '12.ABC.345/01DE-35'
  update()
  input.focus()
})
update()

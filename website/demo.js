import cpf, { cnpj } from '../src/index.ts'

const input = document.querySelector('#document-input')
const kind = document.querySelector('#document-kind')
const mask = document.querySelector('#formatted-value')
const normalized = document.querySelector('#normalized-value')
const status = document.querySelector('#validation-status')
const example = document.querySelector('#load-example')
const issues = {
  INVALID_TYPE: 'Use um valor em texto.',
  INVALID_CHARACTERS: 'Há caracteres incompatíveis com o documento.',
  INVALID_LENGTH: 'O documento ainda não tem o tamanho completo.',
  INVALID_VERIFIER_CHARACTERS: 'Os dois verificadores precisam ser números.',
  REPEATED_CHARACTERS: 'Sequências de dígitos repetidos não são aceitas.',
  INVALID_CHECK_DIGITS: 'Os dígitos verificadores não conferem.',
}

function update() {
  const api = kind.value === 'cpf' ? cpf : cnpj
  input.inputMode = kind.value === 'cpf' ? 'numeric' : 'text'
  mask.textContent = api.format(input.value, { strict: false }) || '—'
  normalized.textContent = '—'
  status.dataset.valid = ''
  if (!input.value.trim()) {
    status.textContent = 'Digite um documento ou carregue um exemplo.'
    return
  }
  try {
    const value = api.normalize(input.value)
    normalized.textContent = value || '—'
    const result = api.inspect(value)
    status.dataset.valid = String(result.valid)
    status.textContent = result.valid
      ? 'Estrutura e dígitos verificadores válidos.'
      : issues[result.issue]
  } catch {
    status.dataset.valid = 'false'
    status.textContent = 'A entrada contém caracteres ou tamanho incompatíveis.'
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

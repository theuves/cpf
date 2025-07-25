export default function check(cpf: string, options: { strict?: boolean } = {}): boolean {
  const { strict = true } = options
  if (typeof cpf !== 'string') {
    return false
  }
  if (strict) {
    const pattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    return pattern.test(cpf)
  } else {
    cpf = cpf.trim()
    // First check if the string contains only valid characters
    const validChars = /^[\d.\-\s]+$/
    if (!validChars.test(cpf)) {
      return false
    }
    const patterns = [
      /^\d{3}\.?\d{0,3}$/,
      /^\d{3}\.\d{3}\.?\d{0,3}$/,
      /^\d{3}\.\d{3}\.\d{3}-?\d{0,2}$/,
    ]
    return patterns.some(p => p.test(cpf))
  }
}

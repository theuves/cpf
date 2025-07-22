export default function check(cnpj: string, strict: boolean = true): boolean {
  if (typeof cnpj !== 'string') {
    return false
  }
  if (strict) {
    const pattern = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
    return pattern.test(cnpj)
  } else {
    cnpj = cnpj.trim()
    // First check if the string contains only valid characters
    const validChars = /^[\d.\-\/\s]+$/
    if (!validChars.test(cnpj)) {
      return false
    }
    const patterns = [
      /^\d{2}\.?\d{0,3}$/,
      /^\d{2}\.\d{3}\.?\d{0,3}$/,
      /^\d{2}\.\d{3}\.\d{3}\/?\d{0,4}$/,
      /^\d{2}\.\d{3}\.\d{3}\/\d{4}-?\d{0,2}$/,
    ]
    return patterns.some(p => p.test(cnpj))
  }
} 
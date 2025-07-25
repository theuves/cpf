export default function unformat(cnpj: string, options: { strict?: boolean } = {}): string {
  const { strict = true } = options
  // Validate input type - only accept strings
  if (typeof cnpj !== 'string') {
    throw new Error('Input must be a string')
  }

  // Extract only digits from the input
  let digits = cnpj.replace(/\D/g, '')

  // Handle strict mode
  if (strict) {
    // In strict mode, only accept valid characters
    const validChars = /^[\d.\-\/\s]+$/
    if (!validChars.test(cnpj)) {
      throw new Error('Invalid characters in CNPJ input')
    }

    // Check if we have more than 14 digits
    if (digits.length > 14) {
      throw new Error('CNPJ cannot have more than 14 digits')
    }
  }

  // Non-strict mode
  // Truncate if more than 14 digits
  if (digits.length > 14) {
    digits = digits.substring(0, 14)
  }

  return digits
}

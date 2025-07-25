export default function unformat(cpf: string, options: { strict?: boolean } = {}): string {
  const { strict = true } = options
  // Validate input type - only accept strings
  if (typeof cpf !== 'string') {
    throw new Error('Input must be a string')
  }

  // Extract only digits from the input
  let digits = cpf.replace(/\D/g, '')

  // Handle strict mode
  if (strict) {
    // In strict mode, only accept valid characters
    const validChars = /^[\d.\-\s]+$/
    if (!validChars.test(cpf)) {
      throw new Error('Invalid characters in CPF input')
    }

    // Check if we have more than 11 digits
    if (digits.length > 11) {
      throw new Error('CPF cannot have more than 11 digits')
    }
  }

  // Non-strict mode
  // Truncate if more than 11 digits
  if (digits.length > 11) {
    digits = digits.substring(0, 11)
  }

  return digits
}

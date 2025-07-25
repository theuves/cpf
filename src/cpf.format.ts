export default function format(
  cpf: string | number,
  options: { strict?: boolean } = {}
): string {
  const { strict = true } = options
  // Handle number input in non-strict mode
  if (typeof cpf === 'number') {
    if (strict) {
      throw new Error('Number input is only allowed when strict=false')
    }
    cpf = cpf.toString().padStart(11, '0')
  }

  // Validate input type
  if (typeof cpf !== 'string') {
    throw new Error('Input must be a string or number')
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

    // If less than 11 digits, format what we have
    if (digits.length < 11) {
      return formatPartial(digits)
    }

    // Format complete CPF
    return formatComplete(digits)
  }

  // Non-strict mode
  // Truncate if more than 11 digits
  if (digits.length > 11) {
    digits = digits.substring(0, 11)
  }

  // Format the digits
  return digits.length === 11 ? formatComplete(digits) : formatPartial(digits)
}

function formatComplete(digits: string): string {
  return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`
}

function formatPartial(digits: string): string {
  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 6) {
    return `${digits.substring(0, 3)}.${digits.substring(3)}`
  } else if (digits.length <= 9) {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`
  } else {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9)}`
  }
}

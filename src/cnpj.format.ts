export default function format(
  cnpj: string | number,
  options: { strict?: boolean } = {}
): string {
  const { strict = true } = options
  // Handle number input in non-strict mode
  if (typeof cnpj === 'number') {
    if (strict) {
      throw new Error('Number input is only allowed when strict=false')
    }
    cnpj = cnpj.toString().padStart(14, '0')
  }

  // Validate input type
  if (typeof cnpj !== 'string') {
    throw new Error('Input must be a string or number')
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

    // If less than 14 digits, format what we have
    if (digits.length < 14) {
      return formatPartial(digits)
    }

    // Format complete CNPJ
    return formatComplete(digits)
  }

  // Non-strict mode
  // Truncate if more than 14 digits
  if (digits.length > 14) {
    digits = digits.substring(0, 14)
  }

  // Format the digits
  return digits.length === 14 ? formatComplete(digits) : formatPartial(digits)
}

function formatComplete(digits: string): string {
  return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12, 14)}`
}

function formatPartial(digits: string): string {
  if (digits.length <= 2) {
    return digits
  } else if (digits.length <= 5) {
    return `${digits.substring(0, 2)}.${digits.substring(2)}`
  } else if (digits.length <= 8) {
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5)}`
  } else if (digits.length <= 12) {
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8)}`
  } else {
    return `${digits.substring(0, 2)}.${digits.substring(2, 5)}.${digits.substring(5, 8)}/${digits.substring(8, 12)}-${digits.substring(12)}`
  }
}

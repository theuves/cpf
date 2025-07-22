import parser from './core/cnpj.parser'
import calc from './cnpj.calc'

export default function validate(cnpj: string): boolean {
  try {
    // Check if input is a string
    if (typeof cnpj !== 'string') {
      return false
    }

    // Check if string contains only valid CNPJ characters (digits, dots, dash, slash, spaces)
    const validChars = /^[\d.\-\/\s]+$/
    if (!validChars.test(cnpj)) {
      return false
    }

    // Extract digits and check if more than 14
    const digits = cnpj.replace(/\D/g, '')
    if (digits.length > 14) {
      return false
    }

    const parsed = parser(cnpj)

    // Check if we have enough digits (at least 14)
    if (parsed.digits.length < 14) {
      return false
    }

    // Check if we have exactly 14 digits
    if (parsed.digits.length !== 14) {
      return false
    }

    // Check if all digits are the same (invalid CNPJ)
    if (parsed.digits.every(digit => digit === parsed.digits[0])) {
      return false
    }

    // Calculate expected verifiers
    const expectedVerifiers = calc(parsed.fullBody)

    // Compare with actual verifiers
    return (
      expectedVerifiers[0] === parsed.verifiers[0] &&
      expectedVerifiers[1] === parsed.verifiers[1]
    )
  } catch {
    return false
  }
} 
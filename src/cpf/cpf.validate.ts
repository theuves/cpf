import parser from './cpf.parser'
import calc from './cpf.calc'

export default function validate(cpf: string): boolean {
  try {
    // Check if input is a string
    if (typeof cpf !== 'string') {
      return false
    }

    // Check if string contains only valid CPF characters (digits, dots, dash, spaces)
    const validChars = /^[\d.\-\s]+$/
    if (!validChars.test(cpf)) {
      return false
    }

    // Extract digits and check if more than 11
    const digits = cpf.replace(/\D/g, '')
    if (digits.length > 11) {
      return false
    }

    const parsed = parser(cpf)

    // Check if we have enough digits (at least 11)
    if (parsed.digits.length < 11) {
      return false
    }

    // Check if we have exactly 11 digits
    if (parsed.digits.length !== 11) {
      return false
    }

    // Check if all digits are the same (invalid CPF)
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

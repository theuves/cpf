/**
 * Format a CPF number
 * @param {string} cpf CPF number
 * @return Formatted CPF number
 * @example
 * format('11144477725')
 * //-> '111.444.777-35'
 */
export default function format(cpf) {
  if (typeof cpf !== 'string') throw new TypeError('Must be a string')
  const digits = cpf.replace(/\D/g, '')

  // Must have 11 digits
  if (digits.length !== 11) throw new Error('Invalid CPF number')

  const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
  const mask = '$1.$2.$3-$4'
  return digits.replace(regex, mask)
}

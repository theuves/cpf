/**
 * Format a CPF number.
 *
 * @param {string} cpf Unformatted CPF number.
 * @returns {string} Formatted CPF number.
 */
module.exports = (cpfNumber) => {
  if (typeof cpfNumber !== 'string') {
    throw new Error('Invalid CPF number')
  }

  const unformattedCpf = cpfNumber.replace(/\D/g, '')

  if (unformattedCpf.length !== 11) {
    throw new Error('Invalid CPF number')
  }

  const regex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
  const mask = '$1.$2.$3-$4'

  return unformattedCpf.replace(regex, mask)
}

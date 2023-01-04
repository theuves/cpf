const mask = {
  cpf(val) {
    return val
      .replace(/(\d{11})\d/, '$1')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2');
  },
};


const onlyDigits = val => {
  return val.replace(/\D/g, '');
};

/**
 * Format a CPF number.
 *
 * @param {string} cpf Unformatted CPF number.
 * @returns {string} Formatted CPF number.
 */
module.exports = (cpfNumber) => {
  const digits = onlyDigits(cpfNumber);
  return mask.cpf(digits);
}

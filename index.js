// CommonJS entry point for backward compatibility
const { format, generate, isValid, getCD } = require('./dist/cpf.min.js');

module.exports = {
  format,
  generate,
  isValid,
  getCD
};

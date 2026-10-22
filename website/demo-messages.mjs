export const demoMessages = {
  pt: {
    idle: 'Digite um documento ou carregue um exemplo.',
    valid: 'Estrutura e dígitos verificadores válidos.',
    invalid: 'A entrada contém caracteres ou tamanho incompatíveis.',
    issues: {
      INVALID_TYPE: 'Use um valor em texto.',
      INVALID_CHARACTERS: 'Há caracteres incompatíveis com o documento.',
      INVALID_LENGTH: 'O documento ainda não tem o tamanho completo.',
      INVALID_VERIFIER_CHARACTERS:
        'Os dois verificadores precisam ser números.',
      REPEATED_CHARACTERS: 'Sequências de dígitos repetidos não são aceitas.',
      INVALID_CHECK_DIGITS: 'Os dígitos verificadores não conferem.',
    },
  },
  en: {
    idle: 'Enter a document number or load an example.',
    valid: 'Valid structure and check digits.',
    invalid: 'The input contains unsupported characters or an invalid length.',
    issues: {
      INVALID_TYPE: 'Use a text value.',
      INVALID_CHARACTERS: 'The document contains unsupported characters.',
      INVALID_LENGTH: 'The document is not yet complete.',
      INVALID_VERIFIER_CHARACTERS: 'Both check digits must be numbers.',
      REPEATED_CHARACTERS: 'Repeated digit sequences are not allowed.',
      INVALID_CHECK_DIGITS: 'The check digits do not match.',
    },
  },
}

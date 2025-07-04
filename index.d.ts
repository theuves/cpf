declare module 'cpf' {
  /**
   * Format a CPF number with dots and dash.
   */
  export function format(cpfNumber: string): string;

  /**
   * Generate a random CPF number.
   */
  export function generate(formatted?: boolean, invalid?: boolean): string;

  /**
   * Check if a CPF number is valid.
   */
  export function isValid(cpfNumber: string, byLength?: boolean): boolean;

  /**
   * Get the check digits of a CPF number.
   */
  export function getCD(digits: number[]): number[];

  // Type definitions
  export interface CPFGeneratorOptions {
    formatted?: boolean;
    invalid?: boolean;
  }

  export interface CPFValidatorOptions {
    byLength?: boolean;
  }
}

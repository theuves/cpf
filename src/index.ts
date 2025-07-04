export { format } from './format';
export { generate } from './generate';
export { isValid } from './is-valid';
export { getCD } from './get-cd';

// Tipos para o módulo
export interface CPFGeneratorOptions {
  formatted?: boolean;
  invalid?: boolean;
}

export interface CPFValidatorOptions {
  byLength?: boolean;
} 
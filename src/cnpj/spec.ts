import type { DocumentSpec } from '../core/types'

// Numeric-only adapter retained for shared-core regression tests and common
// weights/format metadata. Public CNPJ operations use codec.ts.
export const numericCnpjSpec: DocumentSpec = {
  name: 'CNPJ',
  bodyLength: 12,
  totalLength: 14,
  weights: [
    [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
  ],
  formatSegments: [
    { length: 2 },
    { length: 3, separator: '.' },
    { length: 3, separator: '.' },
    { length: 4, separator: '/' },
    { length: 2, separator: '-' },
  ],
  strictPattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  partialPatterns: [
    /^\d{2}\.?\d{0,3}$/,
    /^\d{2}\.\d{3}\.?\d{0,3}$/,
    /^\d{2}\.\d{3}\.\d{3}\/?\d{0,4}$/,
    /^\d{2}\.\d{3}\.\d{3}\/\d{4}-?\d{0,2}$/,
  ],
  validCharsPattern: /^[\d.\-/\s]+$/,
}

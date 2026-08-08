import type { DocumentSpec } from '../core/types'

export const cpfSpec: DocumentSpec = {
  name: 'CPF',
  bodyLength: 9,
  totalLength: 11,
  weights: [
    [10, 9, 8, 7, 6, 5, 4, 3, 2],
    [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  ],
  formatSegments: [
    { length: 3 },
    { length: 3, separator: '.' },
    { length: 3, separator: '.' },
    { length: 2, separator: '-' },
  ],
  strictPattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  partialPatterns: [
    /^\d{3}\.?\d{0,3}$/,
    /^\d{3}\.\d{3}\.?\d{0,3}$/,
    /^\d{3}\.\d{3}\.\d{3}-?\d{0,2}$/,
  ],
  validCharsPattern: /^[\d.\-\s]+$/,
}

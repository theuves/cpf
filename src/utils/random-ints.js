import random from './random'

/**
 * Generate a array with random values
 * @param {number} length Array length
 * @param {number} max Maximum number to generate
 * @return {number} Random array
 */
export default function randomInts(length, max) {
  return Array
    .from(Array(length))
    .map(() => random(max))
}
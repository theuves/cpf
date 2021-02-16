/**
 * Generate a random number
 * @param {number} max Maximum number to generate
 * @return {number} Random number
 */
export default function random(max = 0) {
  return Math.floor(Math.random() * max + 1)
}
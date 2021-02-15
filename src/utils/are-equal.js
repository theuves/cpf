/**
 * Check if two values are equal
 * @param {any} value1 Any value
 * @param {any} value2 Any value
 * @return {boolean} true or false
 * @example
 * areEqual([4, 2], [4, 2])
 * //-> true
 */
function areEqual(value1, value2) {
  value1 = JSON.stringify(value1)
  value2 = JSON.stringify(value2)
  return value1 === value2
}

module.exports = areEqual
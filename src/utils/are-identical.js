/**
 * Check if all items in an array are identical
 * @param {Array} array Array with any value
 * @return {boolean} true or false
 * @example
 * areIdentical([1, 1, 1])
 * //-> true
 */
function areIdentical(array) {
  return array.every((value, index, self) => {
    // Ignore the first item
    if (index === 0) return true
    // The current item must be equals the previous
    const current = JSON.stringify(value)
    const previous = JSON.stringify(self[index - 1])
    return current === previous
  })
}

module.exports = areIdentical
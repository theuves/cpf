/**
 * Get the check digits of a CPF number
 * @param {Array} digits An array with 9 (nine) digits
 * @return {Array} Check digits (2 items)
 * @example
 * getCheckDigits([1, 1, 1, 4, 4, 4, 7, 7, 7])
 * //-> [3, 5]
 */
function getCheckDigits(digits) {
  // The algorithm used here to get the check digits was found in the Wikipedia
  // page about CPF numbers (in Portuguese) <https://w.wiki/zcv>.
  const checkDigits = [0, 0]
  digits.reverse()
  for (index = 0; index < digits.length; index++) {
    checkDigits[0] += digits[index] * (9 - (index % 10))
    checkDigits[1] += digits[index] * (9 - ((index + 1) % 10))
  }
  checkDigits[0] = (checkDigits[0] % 11) % 10
  checkDigits[1] = ((checkDigits[1] + checkDigits[0] * 9) % 11) % 10
  return checkDigits
}

module.exports = getCheckDigits
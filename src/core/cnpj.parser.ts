export default function parser(cnpj: string) {
  const digitStr = cnpj.replace(/\D/g, '')
  const digits = digitStr
    .slice(0, 14)
    .split('')
    .map(d => parseInt(d))
  const len = digits.length
  const fullBodyLen = Math.min(12, len)
  const fullBody = digits.slice(0, fullBodyLen)
  const part1 = fullBody.slice(0, 2)
  const part2 = fullBody.slice(2, 5)
  const part3 = fullBody.slice(5, 8)
  const part4 = fullBody.slice(8, 12)
  const verifiers = digits.slice(12)
  return {
    digits,
    fullBody,
    bodyParts: {
      part1,
      part2,
      part3,
      part4,
    },
    verifiers,
  }
}

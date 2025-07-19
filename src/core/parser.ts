export default function parser(cpf: string) {
  const digitStr = cpf.replace(/\D/g, '');
  const digits = digitStr.slice(0, 11).split('').map(d => parseInt(d));
  const len = digits.length;
  const fullBodyLen = Math.min(9, len);
  const fullBody = digits.slice(0, fullBodyLen);
  const part1 = fullBody.slice(0, 3);
  const part2 = fullBody.slice(3, 6);
  const part3 = fullBody.slice(6, 9);
  const lastBodyDigit = fullBodyLen === 9 ? fullBody[8] : null;
  const verifiers = digits.slice(9);
  return {
    digits,
    fullBody,
    bodyParts: {
      part1,
      part2,
      part3
    },
    lastBodyDigit,
    verifiers
  };
}

export function calc(body: number[]): number[] {
  if (body.length !== 9) {
    throw new Error('Input must be exactly 9 digits');
  }
  if (!body.every(d => Number.isInteger(d) && d >= 0 && d <= 9)) {
    throw new Error('All elements must be integers between 0 and 9');
  }
  const sum1 = body.reduce((acc, digit, i) => acc + digit * (10 - i), 0);
  const mod1 = sum1 % 11;
  const dv1 = mod1 < 2 ? 0 : 11 - mod1;
  const temp = [...body, dv1];
  const sum2 = temp.reduce((acc, digit, i) => acc + digit * (11 - i), 0);
  const mod2 = sum2 % 11;
  const dv2 = mod2 < 2 ? 0 : 11 - mod2;
  return [dv1, dv2];
}

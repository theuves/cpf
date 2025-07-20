export default function calc(body: number[]): number[] {
  if (body.length !== 12) {
    throw new Error('Input must be exactly 12 digits')
  }
  if (!body.every(d => Number.isInteger(d) && d >= 0 && d <= 9)) {
    throw new Error('All elements must be integers between 0 and 9')
  }
  
  // First check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const sum1 = body.reduce((acc, digit, i) => acc + digit * weights1[i]!, 0)
  const mod1 = sum1 % 11
  const dv1 = mod1 < 2 ? 0 : 11 - mod1
  
  // Second check digit
  const temp = [...body, dv1]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const sum2 = temp.reduce((acc, digit, i) => acc + digit * weights2[i]!, 0)
  const mod2 = sum2 % 11
  const dv2 = mod2 < 2 ? 0 : 11 - mod2
  
  return [dv1, dv2]
}

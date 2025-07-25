import calc from './cnpj.calc'
import format from './cnpj.format'

interface GenerateOptions {
  valid?: boolean
  count?: number
  formatted?: boolean
}

// Function overloads for better type inference
export default function generate(
  options?: GenerateOptions & { count?: 1 }
): string
export default function generate(
  options?: GenerateOptions & { count: number }
): string[]
export default function generate(options: GenerateOptions = {}) {
  const { valid = true, count = 1, formatted = true } = options

  if (count < 1) {
    throw new Error('Count must be at least 1')
  }

  const generateSingle = (): string => {
    const body: number[] = []

    // Generates 12 random digits for the CNPJ body
    for (let i = 0; i < 12; i++) {
      body.push(Math.floor(Math.random() * 10))
    }

    let cnpj: string
    if (valid) {
      const digits = calc(body)
      cnpj = body.join('') + digits[0]?.toString() + digits[1]?.toString()
    } else {
      // For invalid CNPJs, generate random check digits
      const dv1 = Math.floor(Math.random() * 10)
      const dv2 = Math.floor(Math.random() * 10)
      cnpj = body.join('') + dv1.toString() + dv2.toString()
    }

    return formatted ? format(cnpj) : cnpj
  }

  if (count === 1) {
    return generateSingle()
  } else {
    const cnpjs: string[] = []
    for (let i = 0; i < count; i++) {
      cnpjs.push(generateSingle())
    }
    return cnpjs
  }
} 
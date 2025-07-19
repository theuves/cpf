import calc from '../core/calc';
import format from './format';

interface GenerateOptions {
  valid?: boolean;
  count?: number;
  formatted?: boolean;
}

// Function overloads for better type inference
export default function generate(options?: GenerateOptions & { count?: 1 }): string;
export default function generate(options?: GenerateOptions & { count: number }): string[];
export default function generate(options: GenerateOptions = {}) {
  const { valid = true, count = 1, formatted = true } = options;
  
  if (count < 1) {
    throw new Error('Count must be at least 1');
  }

  const generateSingle = (): string => {
    const body: number[] = [];
    
    // Generates 9 random digits for the CPF body
    for (let i = 0; i < 9; i++) {
      body.push(Math.floor(Math.random() * 10));
    }

    let cpf: string;
    if (valid) {
      const digits = calc(body);
      cpf = body.join('') + digits[0]?.toString() + digits[1]?.toString();
    } else {
      // For invalid CPFs, generate random check digits
      const dv1 = Math.floor(Math.random() * 10);
      const dv2 = Math.floor(Math.random() * 10);
      cpf = body.join('') + dv1.toString() + dv2.toString();
    }

    return formatted ? format(cpf) : cpf;
  };

  if (count === 1) {
    return generateSingle();
  } else {
    const cpfs: string[] = [];
    for (let i = 0; i < count; i++) {
      cpfs.push(generateSingle());
    }
    return cpfs;
  }
}

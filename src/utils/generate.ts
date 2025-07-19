import { calc } from '../core/calc';

export function generate(valid: boolean = true, count: number = 1): string | string[] {
  if (count < 1) {
    throw new Error('Count must be at least 1');
  }

  const generateSingle = (): string => {
    const body: number[] = [];
    
    // Gera 9 dígitos aleatórios para o corpo do CPF
    for (let i = 0; i < 9; i++) {
      body.push(Math.floor(Math.random() * 10));
    }

    if (valid) {
      const digits = calc(body);
      return body.join('') + digits[0]?.toString() + digits[1]?.toString();
    } else {
      // Para CPFs inválidos, gera dígitos verificadores aleatórios
      const dv1 = Math.floor(Math.random() * 10);
      const dv2 = Math.floor(Math.random() * 10);
      return body.join('') + dv1.toString() + dv2.toString();
    }
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

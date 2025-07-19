import parser from './parser';
import calc from './calc';

export default function validate(cpf: string): boolean {
  try {
    const parsed = parser(cpf);
    
    // Check if we have enough digits (at least 11)
    if (parsed.digits.length < 11) {
      return false;
    }
    
    // Check if we have exactly 11 digits
    if (parsed.digits.length !== 11) {
      return false;
    }
    
    // Check if all digits are the same (invalid CPF)
    if (parsed.digits.every(digit => digit === parsed.digits[0])) {
      return false;
    }
    
    // Calculate expected verifiers
    const expectedVerifiers = calc(parsed.fullBody);
    
    // Compare with actual verifiers
    return expectedVerifiers[0] === parsed.verifiers[0] && 
           expectedVerifiers[1] === parsed.verifiers[1];
  } catch {
    return false;
  }
}

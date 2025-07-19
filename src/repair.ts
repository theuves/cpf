import validate from './validate';
import calc from './calc';

export default function repair(cpfBroken: string): string[] {
  if (typeof cpfBroken !== 'string') return [];
  
  const cleanCpf = cpfBroken.replace(/[^0-9X]/g, '');
  if (cleanCpf.length !== 11) return [];

  const xCount = (cleanCpf.match(/X/g) || []).length;
  if (xCount === 0) {
    return validate(cleanCpf) ? [cleanCpf] : [];
  }
  if (xCount > 2) return [];
  if (xCount === 2 && !(cleanCpf[9] === 'X' && cleanCpf[10] === 'X')) return [];

  if (xCount === 1) {
    return repairSingleX(cleanCpf);
  }
  
  if (xCount === 2) {
    return repairTwoVerifiers(cleanCpf);
  }

  return [];
}

function repairSingleX(cpf: string): string[] {
  const xPosition = cpf.indexOf('X');
  
  // If X is in the verifier digits, calculate directly
  if (xPosition === 9) {
    const body = cpf.slice(0, 9).split('').map(d => parseInt(d));
    const verifiers = calc(body);
    if (verifiers[0] === undefined) return [];
    const result = cpf.replace('X', verifiers[0].toString());
    return validate(result) ? [result] : [];
  }
  
  if (xPosition === 10) {
    const body = cpf.slice(0, 9).split('').map(d => parseInt(d));
    const verifiers = calc(body);
    if (verifiers[0] === undefined || verifiers[1] === undefined) return [];
    const result = cpf.replace('X', verifiers[1].toString());
    return validate(result) ? [result] : [];
  }
  
  // If X is in the base digits, test only 10 possibilities
  const validCpfs: string[] = [];
  for (let digit = 0; digit <= 9; digit++) {
    const testCpf = cpf.replace('X', digit.toString());
    if (validate(testCpf)) {
      validCpfs.push(testCpf);
    }
  }
  return validCpfs;
}

function repairTwoVerifiers(cpf: string): string[] {
  const body = cpf.slice(0, 9).split('').map(d => parseInt(d));
  const verifiers = calc(body);
  if (verifiers[0] === undefined || verifiers[1] === undefined) return [];
  const cpfWithFirstVerifier = cpf.replace('X', verifiers[0].toString());
  const result = cpfWithFirstVerifier.replace('X', verifiers[1].toString());
  return validate(result) ? [result] : [];
}

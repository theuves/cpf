/* c8 ignore next */
import parse from './parse'

/*
 * RF (Região Fiscal) é uma divisão da Receita Federal para gerenciar
 * impostos e fiscalização em regiões do Brasil.
 *
 * Mais detalhes em:
 * https://www.gov.br/receitafederal/pt-br/assuntos/educacao-fiscal/educacao_fiscal/folhetos-orientativos/cadastros-dig.pdf
 */

export default function getFiscalRegions(cpf: string): string[] {
  if (typeof cpf !== 'string') {
    return []
  }

  let parsed: import('./parse').ParseResult
  try {
    parsed = parse(cpf)
  } catch {
    return []
  }

  const rfMap: { [key: number]: string[] } = {
    0: ['RS'],
    1: ['DF', 'GO', 'MS', 'MT', 'TO'],
    2: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR'],
    3: ['CE', 'MA', 'PI'],
    4: ['AL', 'PB', 'PE', 'RN'],
    5: ['BA', 'SE'],
    6: ['MG'],
    7: ['ES', 'RJ'],
    8: ['SP'],
    9: ['PR', 'SC'],
  }

  return rfMap[Number(parsed.regionDigit)] as string[]
}

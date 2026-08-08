import test from 'ava'
import getKind from '../get-kind'

test('should identify numeric and alphanumeric CNPJs', t => {
  t.is(getKind('11.222.333/0001-81'), 'numeric')
  t.is(getKind('12.ABC.345/01DE-35'), 'alphanumeric')
  t.is(getKind('12ABC34501DE36'), 'alphanumeric')
})

test('should return null when the CNPJ structure cannot be classified', t => {
  t.is(getKind(null), null)
  t.is(getKind('12.abc.345/01de-35'), null)
  t.is(getKind('12.ABC'), null)
  t.is(getKind('12.ABC.345/01DE-3A'), null)
})

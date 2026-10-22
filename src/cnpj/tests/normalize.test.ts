import test from 'ava'
import normalize from '../normalize'
import parse from '../parse'

test('should normalize ASCII lowercase letters and preserve partial inputs', t => {
  t.is(normalize('12.abc.345/01de-35'), '12ABC34501DE35')
  t.is(normalize('00.abc'), '00ABC')
  t.is(normalize(''), '')
})

test('should reject Unicode characters that uppercase to ASCII', t => {
  for (const input of [
    '12ßC34501DE33',
    '12ABC34501Dı35',
    '12ABC34501Dſ35',
    '12ﬀC34501DE33',
  ]) {
    t.throws(() => normalize(input), {
      message: 'Invalid characters in CNPJ input',
    })
    t.throws(() => parse(input), {
      message: 'Invalid characters in CNPJ input',
    })
  }
})

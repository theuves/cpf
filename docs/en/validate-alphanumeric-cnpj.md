# Validate alphanumeric CNPJ in JavaScript

The `cpf` library also exports `cnpj`, supporting numeric and alphanumeric
bodies. CNPJ is Brazil's legal entity registration number. Its body contains
12 `A-Z0-9` characters; the final two check digits remain numeric. The same
validator handles both representations.

## Validate numeric and alphanumeric CNPJ

```sh
npm install cpf
```

```ts
import { cnpj } from 'cpf'

cnpj.isValid('11.222.333/0001-81') // true
cnpj.isValid('12.ABC.345/01DE-35') // true
cnpj.isValid('12ABC34501DE35')     // true
cnpj.isValid('12ABC34501DE36')     // false
cnpj.isValid('12ABC34501DE3A')     // false: letter in a check digit
```

You can also import only the CNPJ namespace with `import cnpj from 'cpf/cnpj'`.
In CommonJS, use `const { cnpj } = require('cpf')`.

## Normalize lowercase letters before validation

`isValid` and `inspect` expect uppercase letters. To accept lowercase input,
normalize it and handle character or length errors.

```ts
function isValidCnpjInput(input: string): boolean {
  try {
    return cnpj.isValid(cnpj.normalize(input))
  } catch {
    return false
  }
}

isValidCnpjInput('12.abc.345/01de-35') // true
```

Keep the document number as text. Cleaning it with `replace(/\D/g, '')` removes
letters that are part of the CNPJ; converting it to a number also loses leading
zeros.

## Inspect and classify input

```ts
cnpj.inspect('12ABC34501DE36')
// { valid: false, normalized: '12ABC34501DE36',
//   issue: 'INVALID_CHECK_DIGITS' }

cnpj.getKind('12ABC34501DE35')     // 'alphanumeric'
cnpj.getKind('11222333000181')     // 'numeric'
cnpj.getKind('12ABC')             // null
```

`getKind` classifies the structure; it does not verify the mathematical value
of the check digits. Use `isValid` or `inspect` for that check.

## Calculate check digits

```ts
cnpj.calculateCheckDigits('12ABC34501DE') // [3, 5]
```

The calculation uses modulo 11 and each character's ASCII value minus 48, as
described in the [Brazilian Federal Revenue Service's calculation manual](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf)
(in Portuguese). Its [Alphanumeric CNPJ program](https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/cnpj-alfanumerico)
collects the official guidance. The library checks structure and check digits;
it does not query existence, ownership or registration status.

See also [CPF and CNPJ input masks](cpf-cnpj-input-masks.md) and
[React integration](cpf-cnpj-react.md).

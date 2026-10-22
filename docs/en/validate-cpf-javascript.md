# Validate CPF in JavaScript and TypeScript

Use `cpf.isValid` to check the length, characters and two check digits of a CPF,
Brazil's individual taxpayer identification number. The library accepts formatted
and unformatted values and returns a boolean. Validation runs locally: it does
not query the Brazilian Federal Revenue Service or confirm that a CPF was issued
or belongs to a person.

## Installation and first example

```sh
npm install cpf
```

```ts
import cpf from 'cpf'

cpf.isValid('529.982.247-25') // true
cpf.isValid('52998224725')   // true
cpf.isValid('52998224726')   // false: invalid check digits
cpf.isValid('11111111111')   // false: repeated sequence
cpf.isValid('')             // false: incomplete input
```

The same code works in JavaScript. TypeScript declarations are included; no
separate `@types` package is needed. In CommonJS, use
`const { default: cpf } = require('cpf')`.

## Keep CPF values as text

A CPF may start with zero. Keep it as a `string` in forms, JSON and storage.
Converting it with `Number` or `parseInt` removes leading zeros before the
library even receives the value.

```ts
const input = '012.345.678-90'
const normalized = cpf.normalize(input)
// '01234567890'

const valid: boolean = cpf.isValid(normalized)
```

`normalize` removes allowed separators but does not validate check digits.
Unsupported characters or excessively long inputs cause it to throw.

## Explain why validation failed

`inspect` applies the same validation rules and returns the first failure.

```ts
const result = cpf.inspect('529.982.247-26')

if (!result.valid) {
  console.log(result.issue) // 'INVALID_CHECK_DIGITS'
}
```

For values received in a request, `inspect` accepts `unknown` and identifies
unexpected types as well. Validate again on the server even if the browser
has already checked the value.

## Formatting and validity are different checks

```ts
cpf.matchesFormat('529.982.247-26') // true: complete mask
cpf.isValid('529.982.247-26')       // false: invalid check digits
cpf.format('5299822')              // '529.982.2': partial input
```

A regular expression can check the mask, but it cannot replace check digit
calculation. `isValid` accepts allowed separators outside their canonical
positions. If your application requires the exact mask, combine both checks.

Continue with [input masks](cpf-cnpj-input-masks.md) or the
[React form example](cpf-cnpj-react.md).

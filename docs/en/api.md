# CPF and CNPJ API reference

The default export and the named `cpf` export contain CPF operations.
The named `cnpj` export contains CNPJ operations.

| Operation | CPF | CNPJ | Return value |
| --- | :---: | :---: | --- |
| [`isValid`](#isvalidvalue) | ✓ | ✓ | `boolean` |
| [`inspect`](#inspectvalue) | ✓ | ✓ | inspection result |
| [`matchesFormat`](#matchesformatvalue-options) | ✓ | ✓ | `boolean` |
| [`format`](#formatvalue-options) | ✓ | ✓ | `string` |
| [`normalize`](#normalizevalue) | ✓ | ✓ | `string` |
| [`parse`](#parsevalue) | ✓ | ✓ | semantic parts |
| [`calculateCheckDigits`](#calculatecheckdigitsbody) | ✓ | ✓ | `[number, number]` |
| [`findValidRepairs`](#findvalidrepairsvalue-options) | ✓ | ✓ | `string[]` |
| [`generate`](#generateoptions) | ✓ | ✓ | `string` |
| [`generateMany`](#generatemanycount-options) | ✓ | ✓ | `string[]` |
| [`getFiscalRegions`](#cpfgetfiscalregionsvalue) | ✓ | — | `string[]` |
| [`getKind`](#cnpjgetkindvalue) | — | ✓ | `CnpjKind \| null` |

### `isValid(value)`

Checks length, characters, repetition rules and check digits. Invalid input
returns `false`; the function does not throw for unexpected types.

```ts
cpf.isValid('529.982.247-25') // true
cpf.isValid('529.982.247-26') // false

cnpj.isValid('11.222.333/0001-81') // true
cnpj.isValid('12.ABC.345/01DE-35') // true
```

Strict CNPJ operations expect uppercase letters. Use `normalize` to prepare
input that may contain lowercase letters.

### `inspect(value)`

Performs the same checks as `isValid`, but returns the normalized value and,
on failure, a code identifying the first rule that was violated.

```ts
cpf.inspect('529.982.247-26')
// {
//   valid: false,
//   normalized: '52998224726',
//   issue: 'INVALID_CHECK_DIGITS'
// }

cnpj.inspect('12.ABC.345/01DE-35')
// { valid: true, normalized: '12ABC34501DE35' }
```

Possible `issue` values are:

- `INVALID_TYPE`;
- `INVALID_CHARACTERS`;
- `INVALID_LENGTH`;
- `INVALID_VERIFIER_CHARACTERS` — CNPJ only;
- `REPEATED_CHARACTERS`;
- `INVALID_CHECK_DIGITS`.

`normalized` is `null` when the input cannot be normalized safely.

### `matchesFormat(value[, options])`

Checks only the mask. It does not calculate or validate check digits.

```ts
cpf.matchesFormat('529.982.247-25') // true
cpf.matchesFormat('529.982', { completeness: 'partial' }) // true

cnpj.matchesFormat('12.ABC.345/01DE-35') // true
```

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| `completeness` | `complete`, `partial` | `complete` | Requires a complete mask or accepts partial input. |

### `format(value[, options])`

Applies the canonical mask and accepts partial strings, allowing formatting
while users fill out a form.

```ts
cpf.format('5299822') // '529.982.2'
cpf.format('52998224725') // '529.982.247-25'

cnpj.format('12ABC34501DE35') // '12.ABC.345/01DE-35'
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `strict` | `boolean` | `true` | Rejects unsupported characters and values longer than the document. With `false`, cleans and truncates input. |

Numeric input is accepted only with `strict: false` and must be a non-negative
safe integer. Prefer strings to preserve leading zeros.

### `normalize(value)`

Removes the mask without removing leading zeros. For CNPJ, letters are converted
to uppercase.

```ts
cpf.normalize('529.982.247-25') // '52998224725'
cnpj.normalize('12.abc.345/01de-35') // '12ABC34501DE35'
```

### `parse(value)`

Requires a complete representation after removing allowed separators and splits
it into semantic parts. For CNPJ, it converts letters to uppercase. `parse` does
not check separator positions or check digits; use `matchesFormat` and `isValid`
for those checks.

```ts
cpf.parse('529.982.247-25')
// {
//   value: '52998224725',
//   body: '529982247',
//   checkDigits: '25',
//   regionDigit: '7'
// }

cnpj.parse('12.ABC.345/01DE-35')
// {
//   value: '12ABC34501DE35',
//   root: '12ABC345',
//   branch: '01DE',
//   checkDigits: '35'
// }
```

### `calculateCheckDigits(body)`

Calculates both check digits. CPF takes an array of nine digits; CNPJ takes a
string or an array containing the twelve body characters.

```ts
cpf.calculateCheckDigits([5, 2, 9, 9, 8, 2, 2, 4, 7]) // [2, 5]
cnpj.calculateCheckDigits('12ABC34501DE') // [3, 5]
```

### `findValidRepairs(value[, options])`

Returns mathematically valid candidates for an unknown position. CPF uses `X`
as a placeholder; CNPJ uses `?` by default.

```ts
cpf.findValidRepairs('5299822472X') // ['52998224725']
cnpj.findValidRepairs('12.ABC.345/01DE-3?') // ['12ABC34501DE35']
```

CNPJ lets you configure `placeholder` and restrict candidates with
`kind: 'numeric' | 'alphanumeric'`. Without `kind`, the search considers numbers
and letters, including when the unknown position is the only letter in the body.
Two placeholders are accepted only in the check digit positions.

### `generate([options])`

Generates a CPF or CNPJ and always returns a string.

```ts
cpf.generate()
cpf.generate({ validity: 'invalid', output: 'plain' })

cnpj.generate({ kind: 'alphanumeric' })
```

| Option | Values or type | Default | Availability |
| --- | --- | --- | --- |
| `validity` | `valid`, `invalid` | `valid` | CPF and CNPJ |
| `output` | `formatted`, `plain` | `formatted` | CPF and CNPJ |
| `randomSource` | `() => number` | `Math.random` | CPF and CNPJ |
| `kind` | `numeric`, `alphanumeric` | `numeric` | CNPJ only |

`randomSource` must return a number in `[0, 1)`. Generation is not
cryptographically secure and does not guarantee uniqueness.

### `generateMany(count[, options])`

Generates a list using the same options as `generate`. `count` must be an integer
between 1 and 10,000. Split larger volumes into smaller batches to avoid keeping
all results in memory at once.

```ts
cpf.generateMany(3, { output: 'plain' })
cnpj.generateMany(3, { kind: 'alphanumeric' })
```

### `cpf.getFiscalRegions(value)`

Returns the Brazilian state abbreviations associated with the ninth digit in
the CPF body. This classification does not validate check digits.

```ts
cpf.getFiscalRegions('529.982.247-25') // ['ES', 'RJ']
```

### `cnpj.getKind(value)`

Classifies a complete structure as `numeric` or `alphanumeric`. Returns `null`
for an incompatible structure and does not validate check digits.

```ts
cnpj.getKind('11.222.333/0001-81') // 'numeric'
cnpj.getKind('12.ABC.345/01DE-35') // 'alphanumeric'
```

## Validation and errors

Query operations avoid exceptions for invalid input. Operations that transform
data or receive explicit options reject invalid contracts.

| Operation | Behavior for invalid input |
| --- | --- |
| `isValid` | Returns `false`. |
| `inspect` | Returns a result with `valid: false` and the code in `issue`. |
| `getKind` | Returns `null`. |
| `getFiscalRegions` | Returns `[]`. |
| `matchesFormat` | Returns `false`; throws if `completeness` is invalid. |
| `format`, `normalize`, `parse` | Throw for types, characters or lengths incompatible with their contracts. |
| `calculateCheckDigits` | Throws for a body with invalid length or characters. |
| `findValidRepairs` | Returns `[]`; CNPJ throws if `placeholder` is invalid. |
| `generate`, `generateMany` | Throw for invalid options, a count outside 1–10,000 or a random source outside `[0, 1)`. |

## Modules and formats

### ESM

```ts
import cpf, { cnpj } from 'cpf'
import { cpf as namedCpf } from 'cpf'

import cpfOnly, { isValid as isValidCpf } from 'cpf/cpf'
import cnpjOnly, { isValid as isValidCnpj } from 'cpf/cnpj'
```

Subpaths provide the namespace as a default export and each operation as a
named export.

### CommonJS

```js
const { default: cpf, cpf: namedCpf, cnpj } = require('cpf')
const cpfOnly = require('cpf/cpf').default
const cnpjOnly = require('cpf/cnpj').default
```

### Browser

The IIFE bundle exposes `globalThis.cpf`; the CNPJ namespace is available at
`globalThis.cpf.cnpj`.

### TypeScript

The package includes declarations for ESM and CommonJS. The main public types are:

- `DocumentIssueCode`;
- `CpfIssueCode`, `CpfInspectionResult` and `CnpjInspectionResult`;
- `CpfGenerationOptions` and `CnpjGenerationOptions`;
- `CpfGenerationValidity`, `CnpjGenerationValidity`, `CpfGenerationOutput` and
  `CnpjGenerationOutput`;
- `CpfFormatOptions` and `CnpjFormatOptions`;
- `CpfFormatMatchOptions` and `CnpjFormatMatchOptions`;
- `CpfParseResult` and `CnpjParseResult`;
- `CnpjKind`, `CnpjCharacter` and `CnpjAsciiCharacter`.

The `cpf/cnpj` subpath also exports `CnpjBody` and `RepairOptions`. In subpaths,
shared types are exported without the `Cpf` and `Cnpj` prefixes, such as
`FormatOptions`, `GenerationOptions`, `GenerationValidity`, `GenerationOutput`,
`InspectionResult` and `ParseResult`.

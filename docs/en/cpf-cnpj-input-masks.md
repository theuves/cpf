# CPF and CNPJ input masks in JavaScript

`format` inserts separators and accepts partial input. This lets you display
a CPF or CNPJ as someone fills out a form, without requiring every character
at once.

## Format complete or partial values

```ts
import cpf, { cnpj } from 'cpf'

cpf.format('5299822')          // '529.982.2'
cpf.format('52998224725')      // '529.982.247-25'
cnpj.format('12ABC34501DE35')  // '12.ABC.345/01DE-35'
```

The default mode is strict: it rejects unsupported characters and excessively
long values. To clean input while typing, use `{ strict: false }`.

## Show a mask while typing

This example preserves the input text and cursor, displaying the mask in a
separate `output` element. Editing in the middle of a document number or deleting
separators does not move the cursor unexpectedly.

```html
<label for="document">CNPJ</label>
<input id="document" type="text" autocapitalize="characters"
       spellcheck="false" aria-describedby="mask" />
<output id="mask" for="document"></output>
```

In a JavaScript project that supports npm imports:

```js
import { cnpj } from 'cpf'

const input = document.querySelector('#document')
const output = document.querySelector('#mask')

input.addEventListener('input', () => {
  output.textContent = cnpj.format(input.value, { strict: false })
})
```

For CPF, replace `cnpj.format` with `cpf.format` and use `inputmode="numeric"`.
For alphanumeric CNPJ, keep a keyboard that allows letters.

If you apply the mask to the input itself on every keystroke, your integration
must preserve the selection and handle text composition, pasting and deletion
around separators. The library formats strings; it does not manage events
or the cursor.

## Validate input before accepting the form

Permissive cleaning can discard characters and truncate excess input. Do not
treat the cleaned result as proof that the original input was correct. To accept
a value, normalize and validate the original input, handling normalization errors.

```ts
function readCnpj(input: string): string | null {
  try {
    const normalized = cnpj.normalize(input)
    return cnpj.isValid(normalized) ? normalized : null
  } catch {
    return null
  }
}
```

`matchesFormat` only checks separators. A correct mask can contain incorrect
check digits. See [CPF validation](validate-cpf-javascript.md) and
[alphanumeric CNPJ validation](validate-alphanumeric-cnpj.md).

The [React guide](cpf-cnpj-react.md) shows how to format on blur, keeping the
input controlled without rewriting its value on every keystroke.

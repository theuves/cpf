# CPF and CNPJ in React forms with TypeScript

Use a controlled input to keep the text entered by the user, and validate on
blur or form submission. The example below uses the same operations for CPF
and CNPJ, accepts lowercase CNPJ input and keeps the original text on error.

## Install the library

In an existing React project:

```sh
npm install cpf
```

## Create a reusable field

```tsx
import { useId, useState, type FormEvent } from 'react'
import cpf, { cnpj } from 'cpf'

type Props = {
  kind: 'cpf' | 'cnpj'
  onValid: (normalized: string) => void
}

export function DocumentForm({ kind, onValid }: Props) {
  const id = useId()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const document = kind === 'cpf' ? cpf : cnpj

  function validate(): string | null {
    if (!value.trim()) {
      setError('Enter a document number.')
      return null
    }
    try {
      const normalized = document.normalize(value)
      if (document.isValid(normalized)) {
        setError('')
        return normalized
      }
    } catch {
      // Unsupported characters and excessively long input are also invalid.
    }
    setError(`Check the ${kind.toUpperCase()} number.`)
    return null
  }

  function handleBlur() {
    const normalized = validate()
    if (normalized !== null) setValue(document.format(normalized))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = validate()
    if (normalized !== null) onValid(normalized)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor={id}>{kind.toUpperCase()}</label>
      <input
        id={id}
        name={kind}
        type="text"
        inputMode={kind === 'cpf' ? 'numeric' : 'text'}
        autoCapitalize="characters"
        spellCheck={false}
        value={value}
        onChange={event => {
          setValue(event.target.value)
          setError('')
        }}
        onBlur={handleBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-error`}
      />
      <p id={`${id}-error`} aria-live="polite">{error}</p>
      <button type="submit">Continue</button>
    </form>
  )
}
```

Use `<DocumentForm kind="cnpj" onValid={handleDocument} />` and implement
`handleDocument` for your application. The callback receives only the normalized
value after it passes validation.

## Why format on blur?

`onChange` copies the input text without transforming it. This preserves
selection and editing behavior in the controlled input. The mask is applied
only on `onBlur`, after validation. The [React input documentation](https://react.dev/reference/react-dom/components/input)
explains synchronous state updates and cursor problems caused by transforming
values during typing.

When using server components, place this form in a client component. If your
framework requires a directive such as `'use client'`, put it before the
imports. Validate again on the server before storing the document number.

## Formatting does not query a registry

A valid result confirms the structure and check digits. Your application is
still responsible for checking ownership or registration status when required.
For details, see [CPF](validate-cpf-javascript.md),
[alphanumeric CNPJ](validate-alphanumeric-cnpj.md) and
[input masks](cpf-cnpj-input-masks.md).

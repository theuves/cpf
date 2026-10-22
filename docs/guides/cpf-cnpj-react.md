# CPF e CNPJ em formulários React com TypeScript

Use um campo controlado para guardar o texto digitado e valide ao sair do campo
ou enviar o formulário. O exemplo abaixo usa as mesmas operações para CPF e CNPJ,
aceita minúsculas no CNPJ e mantém o texto original quando há erro.

## Instale a biblioteca

Em um projeto React existente:

```sh
npm install cpf
```

## Crie um campo reutilizável

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
      setError('Preencha o documento.')
      return null
    }
    try {
      const normalized = document.normalize(value)
      if (document.isValid(normalized)) {
        setError('')
        return normalized
      }
    } catch {
      // Caracteres incompatíveis ou entrada longa também são inválidos.
    }
    setError(`Confira o ${kind.toUpperCase()} informado.`)
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
      <button type="submit">Continuar</button>
    </form>
  )
}
```

Use `<DocumentForm kind="cnpj" onValid={handleDocument} />` e implemente
`handleDocument` com o fluxo da sua aplicação. O callback recebe somente o valor
normalizado depois de ele passar pela validação.

## Por que formatar ao sair do campo?

O `onChange` copia o texto digitado sem transformá-lo. Isso mantém o comportamento
de seleção e edição do campo controlado; a máscara só é aplicada no `onBlur`,
depois de validar. A [documentação de inputs do React](https://react.dev/reference/react-dom/components/input)
explica a atualização síncrona do estado e os problemas de cursor ao transformar
o valor durante a digitação.

Em um componente de servidor, coloque esse formulário em um componente cliente.
Se o framework exigir uma diretiva como `'use client'`, ela deve vir antes dos
imports. Valide novamente no servidor antes de persistir o documento.

## Formatação não consulta cadastro

Um retorno válido confirma a estrutura e os verificadores. O aplicativo continua
responsável por confirmar titularidade ou situação cadastral quando isso for
necessário. Para mais detalhes, veja [CPF](validar-cpf-javascript.md),
[CNPJ alfanumérico](validar-cnpj-alfanumerico.md) e
[máscaras durante a digitação](mascara-cpf-cnpj.md).

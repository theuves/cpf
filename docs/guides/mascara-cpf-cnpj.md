# Máscara de CPF e CNPJ em JavaScript

`format` aplica os separadores e aceita entradas parciais. Isso permite mostrar
um CPF ou CNPJ enquanto a pessoa preenche um formulário, sem exigir todos os
caracteres de uma vez.

## Formate valores completos ou parciais

```ts
import cpf, { cnpj } from 'cpf'

cpf.format('5299822')          // '529.982.2'
cpf.format('52998224725')      // '529.982.247-25'
cnpj.format('12ABC34501DE35')  // '12.ABC.345/01DE-35'
```

O modo padrão é estrito: rejeita caracteres incompatíveis e valores longos.
Para limpar uma entrada durante a digitação, use `{ strict: false }`.

## Mostre a máscara durante a digitação

Este exemplo preserva o texto e o cursor do campo, mostrando a máscara em um
`output` separado. Assim, editar no meio do documento e apagar separadores não
causa saltos de cursor.

```html
<label for="documento">CNPJ</label>
<input id="documento" type="text" autocapitalize="characters"
       spellcheck="false" aria-describedby="mascara" />
<output id="mascara" for="documento"></output>
```

Em um projeto JavaScript com suporte a imports npm:

```js
import { cnpj } from 'cpf'

const input = document.querySelector('#documento')
const output = document.querySelector('#mascara')

input.addEventListener('input', () => {
  output.textContent = cnpj.format(input.value, { strict: false })
})
```

Para CPF, troque `cnpj.format` por `cpf.format` e use `inputmode="numeric"`.
Para CNPJ alfanumérico, mantenha um teclado que permita letras.

Se aplicar a máscara no próprio campo a cada tecla, sua integração também precisa
preservar a seleção e tratar composição de texto, colagem e exclusão junto aos
separadores. A biblioteca formata strings; não gerencia eventos ou o cursor.

## Valide a entrada antes de aceitar o formulário

Limpeza permissiva pode descartar caracteres e truncar excessos. Não use o resultado
limpo como prova de que a entrada original estava correta. Para aceitar o valor,
normalize e valide a entrada original, tratando a exceção de normalização.

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

`matchesFormat` verifica apenas os separadores. Uma máscara correta pode conter
verificadores incorretos. Veja [validação de CPF](validar-cpf-javascript.md) e
[validação de CNPJ alfanumérico](validar-cnpj-alfanumerico.md).

O [guia React](cpf-cnpj-react.md) mostra como aplicar a máscara ao sair do campo,
mantendo a digitação controlada sem reescrever o valor a cada tecla.

# `cpf`

> :busts_in_silhouette::brazil: Funções p/ manipular números de CPFs.

## Instalação

Com `npm`:

```
npm install --save cpf
```

## Uso

```js
const CPF = require("cpf");

CPF;
// { calcDv: [Function: calcDv],
//   clear: [Function: clear],
//   format: [Function: format],
//   generate: [Function: generate],
//   isValid: [Function: isValid] }
```

### Funções

- [`CPF.calcDev(digits)`](#cpfcalcdevdigits-view-source)
- [`CPF.clear(cpf)`](#cpfclearcpf-view-source)
- [`CPF.format(cpf)`](#cpfformatcpf-view-source)
- [`CPF.generate([formatted][, invalid])`](#cpfgenerateformatted-invalid-view-source)
- [`CPF.isValid(cpf[, length])`](#cpfisvalidcpf-bylength-view-source)

### `CPF.calcDev(digits)` ([view source](https://git.io/vbxGi))

> Obter os dígitos verificadores dum número de CPF.

#### Exemplos

```js
CPF.calcDev([1, 1, 1, 4, 4, 4, 7, 7, 7]);
// [3, 5]

CPF.calcDev("111444777");
// [3, 5]
```

#### Parâmetros

- `digits=[]` (*Array* ou *String*) - nove dígitos base para obter-se os dígitos verificadores

Retorna uma *Array* contendo os dígitos verificadores.

### `CPF.clear(cpf)` ([view source](https://git.io/vbxGD))

> Desformatar um número de CPF.

#### Exemplos

```js
CPF.clear("111.444.777-35");
// "11144477735"
```

#### Parâmetros

- `cpf=""` (*String*) - um número de CPF formatado

Retorna uma *String* somente com os dígitos do número de CPF.

### `CPF.format(cpf)` ([view source](https://git.io/vbxGd))

> Formatar um número de CPF.

#### Exemplos

```js
CPF.format("11144477735");
// "111.444.777-35"
```

#### Parâmetros

- `cpf=""` (*String*) - um número de CPF, desformatado ou não, para formatar

Retorna uma *String* com o CPF formatado.

### `CPF.generate([formatted][, invalid])` ([view source](https://git.io/vbxMR))

> Gerar um número de CPF aleatório.

#### Parâmetros

- `formatted=true` (*Boolean*) - retornar um número de CPF formatado
- `invalid=false` (*Boolean*) - retornar um número de CPF inválido

Retorna uma *String* com o número de CPF gerado.

### `CPF.isValid(cpf[, byLength])` ([view source](https://git.io/vbxDM))

> Verificar se um número de CPF é válido.

#### Exemplos

```js
CPF.isValid("111.444.777-35");
// true

CPF.isValid("111.444.777-42");
// false

CPF.isValid("111.444.777-42", true);
// true

CPF.isValid("111.444.777", true);
// false
```

#### Parâmetros

- `cpf=""` (*String*) - um número de CPF para ser verificado
- `byLength=false` (*Boolean*) - não validar o dígito verificador, somente o comprimento

Retorna uma valor booleano informando se o CPF é válido ou não.

## Licença

[MIT](https://git.io/vbpk4)

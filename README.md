# `cpf`

> Funções p/ manipular números de CPFs.

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

### `CPF.calcDv(digits)`

> Obter os dígitos verificadores dum número de CPF.

#### Exemplos

```js
CPF.calcDv([1, 1, 1, 4, 4, 4, 7, 7, 7]);
// [3, 5]

CPF.calcDv("111444777");
// [3, 5]
```

#### Parâmetros

- `digits=[]` (*Array* ou *String*) - nove dígitos base para obter-se os dígitos verificadores

Retorna uma *Array* contendo os dígitos verificadores.

### `CPF.clear(cpf)`

> Desformatar um número de CPF.

#### Exemplos

```js
CPF.clear("111.444.777-35");
// "11144477735"
```

#### Parâmetros

- `cpf=""` (*String*) - um número de CPF formatado

Retorna uma *String* somente com os dígitos do número de CPF.

### `CPF.format(cpf)`

> Formatar um número de CPF.

#### Exemplos

```js
CPF.format("11144477735");
// "111.444.777-35"
```

#### Parâmetros

- `cpf=""` (*String*) - um número de CPF, desformatado ou não, para formatar

Retorna uma *String* com o CPF formatado.

### `CPF.generate([formatted][, invalid])`

> Gerar um número de CPF aleatório.

#### Parâmetros

- `formatted=true` (*Boolean*) - retornar um número de CPF formatado
- `invalid=false` (*Boolean*) - retornar um número de CPF inválido

Retorna uma *String* com o número de CPF gerado.

### `CPF.isValid(cpf[, byLength])`

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

# `cpf`

> Functions to handle brazilian CPF numbers

![Status](https://travis-ci.org/theuves/cpf.svg?branch=master)

## Installation

You can install it with *npm* or *yarn*.

Try:

- *npm*: `npm install cpf`
- *yarn*: `yarn add cpf`

## Usage

```js
const CPF = require('cpf');
```

Now, `CPF` is a object with some functions:

- `format`
- `generate`
- `isValid`

### `CPF.format(cpf)`

> Format a CPF number.

#### Example

```js
CPF.format('11144477735');
//=> '111.444.777-35'
```

#### Parameters

- `cpf` {*string*} A CPF number.

Returns a string with the formatted CPF number.

### `CPF.generate(formatted, invalid)`

> Generate a random CPF number.

#### Parameters

- `formatted` {*boolean*} `true` by default. It will generate a formatted CPF number.
- `invalid` {*boolean*} `false` by default. It will generate a invalid CPF number.

Returns a CPF number.

### `CPF.isValid(cpf, byLength)`

> Check if a CPF number is valid.

#### Example

```js
CPF.isValid('111.444.777-35');
// true

CPF.isValid('111.444.777-42');
// false

CPF.isValid('111.444.777-42', true);
// true

CPF.isValid('111.444.777', true);
// false
```

#### Parameters

- `cpf` {*string*} Check if the CPF number is valid.
- `byLength` {*boolean*} `false` by default. Check only if the length is valid.

Returns the check result.

## License

MIT &copy; Matheus Alves

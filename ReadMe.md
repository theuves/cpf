# cpf

> Formatar, gerar ou validar um [CPF](https://pt.wikipedia.org/wiki/CPF).

## Instalação

Com [NPM](http://npmjs.com/):

```
$ npm install cpf
```

## Uso

Veja alguns exemplos:

```js
var CPF = require('cpf');

CPF.formatar(11144477735); //=> '111.444.777-35'
CPF.validar('111.444.777-35'); //=> true
```

Use `CPF.gerar()` para gerar um CPF aleatório.

## Licença

[MIT](http://theuves.mit-license.org/)

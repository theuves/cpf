# cpf

> Formatar, gerar ou validar um [CPF](https://pt.wikipedia.org/wiki/cpf).

## Instalação

Com [NPM](http://npmjs.com/):

```
$ npm install cpf
```

## Uso

Alguns exemplos:

```js
var CPF = require('cpf');

CPF.formatar(11144477735); //=> '111.444.777-35'
CPF.gerar(); //=> '111.444.777-35'
CPF.validar('111.444.777-35'); //=> true
```

## Licença

[MIT](http://theuves.mit-license.org/)

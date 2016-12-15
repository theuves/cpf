# cpf

> Format, generate or validate CPF numbers.
 
Install it with the command `npm install --save cpf`.
 
See some examples:

```js
var CPF = require('cpf');

CPF.format('11144477735'); // returns '111.444.777-35'
CPF.validate('111.444.777-35'); // returns true
```

You can use `CPF.generate()` to generate a random CPF number.

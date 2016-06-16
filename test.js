var assert = require('assert');
var CPF = require('./');

describe('Tests', function () {
    it('.format(cpf)', function () {
        assert.equal(CPF.format('111444'), '111.444');
        assert.equal(CPF.format('1114447'), '111.444.7');
        assert.equal(CPF.format('11144477'), '111.444.77');
        assert.equal(CPF.format('111444777'), '111.444.777');
        assert.equal(CPF.format('1114447773'), '111.444.777-3');
        assert.equal(CPF.format('11144477735'), '111.444.777-35');
        assert.equal(CPF.format('111-444-777-35'), '111.444.777-35');
        assert.equal(CPF.format('111'), '111');
        assert.equal(CPF.format('1114'), '111.4');
        assert.equal(CPF.format('111.4'), '111.4');
        assert.equal(CPF.format('111.'), '111');
        assert.equal(CPF.format('my cpf'), '');
        assert.equal(CPF.format('111 4'), '111.4');
    });

    it('.validate(cpf)', function () {
        assert.equal(CPF.validate('11144477735'), true);
        assert.equal(CPF.validate('111.444.777-35'), true);
        assert.equal(CPF.validate('111.444.777-3'), false);
        assert.equal(CPF.validate('111.444.777-34'), false);
        assert.equal(CPF.validate('111.444.777-355'), false);
    });

    it('.generate()', function () {
        assert.equal(CPF.validate(CPF.generate()), true);
        assert.equal(CPF.generate().length, 14);
        assert.equal(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(CPF.generate()), true);
    });
});

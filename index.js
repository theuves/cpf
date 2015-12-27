'use strict';

var randomInt = require('random-int');

function digVerif(numeros) {
    var pdv = function () {
        var nums = [];

        var n = 0,
            i = 10;

        while (i >= 2) {
            nums.push(i * numeros[n]);
            n = n + 1;
            i = i - 1;
        }

        var num = 0;

        nums.forEach(function (i) {
            num += i;
        });

        var resto = parseInt(num % 11);

        if (resto < 2) {
            return '0';
        } else {
            var digito = 11 - resto;
            return digito.toString();
        }
    };

    numeros.push(pdv());

    var sdv = function () {
        var nums = [];

        var n = 0,
            i = 11;

        while (i >= 2) {
            nums.push(i * numeros[n]);
            n = n + 1;
            i = i - 1;
        }

        var num = 0;

        nums.forEach(function (i) {
            num += i;
        });

        var resto = num % 11;

        if (resto < 2) {
            return '0';
        } else {
            var digito = 11 - resto;
            return digito.toString();
        }
    };

    return pdv() + sdv();
}

function formatar(cpf) {
    cpf = cpf.toString();

    if (/^\d{11}$/.test(cpf)) {
        var num = cpf.match(/\d{3}/g).join('.'),
            ver = cpf.substr(9);

        return num + '-' + ver;
    } else {
        return undefined;
    }
}

function gerar() {
    var numeros = [
        randomInt(9),
        randomInt(9),
        randomInt(9),
        randomInt(9),
        randomInt(9),
        randomInt(9),
        randomInt(9),
        randomInt(9),
        randomInt(9)
    ];

    var jun = numeros.join(''),
        dig = digVerif(numeros);

    return formatar(jun + dig);
}


function validar(cpf) {
    cpf = cpf.toString();

    if (/^\d{11}$/.test(cpf)) {
        cpf = formatar(cpf);
    }

    var re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (re.test(cpf)) {
        var digs = cpf.split('-')[1],
            nums = cpf.split('-')[0]
                .match(/\d/g);

        if (digVerif(nums) === digs) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

module.exports = {
    formatar: formatar,
    gerar: gerar,
    validar: validar
};

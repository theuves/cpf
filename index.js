'use strict';

var shuffleList = require('shuffle-list');

function digVerif(cpf) {
    cpf = cpf.reverse();
    var v1 = 0,
        v2 = 0;

    var i = 0;

    while (i < 9) {
        v1 = v1 + cpf[i] * (9 - (i % 10));
        v2 = v2 + cpf[i] * (9 - ((i + 1) % 10));
        i = i + 1;
    }

    v1 = (v1 % 11) % 10;
    v2 = v2 + v1 * 9;
    v2 = (v2 % 11) % 10;

    return v1 + '' + v2;
}

function formatar(cpf) {
    cpf = cpf.toString();

    if (/^\d{3}(\.)?\d{3}(\.)?\d{3}-?\d{2}$/.test(cpf)) {
        cpf = cpf.replace(/\.|-/g, '');

        var num = cpf.match(/\d{3}/g).join('.'),
            ver = cpf.substr(9);

        return num + '-' + ver;
    } else {
        return false;
    }
}

function gerar() {
    var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        numeros = shuffleList(list).splice(0, 9),
        jun = numeros.join(''),
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

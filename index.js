'use strict';

function dv(cpf) {
    cpf = cpf.reverse();
    var v1 = 0, v2 = 0;

    for (var i = 0; i < 9; i++) {
        v1 = v1 + cpf[i] * (9 - (i % 10));
        v2 = v2 + cpf[i] * (9 - ((i + 1) % 10));
    }

    v1 = (v1 % 11) % 10;
    v2 = ((v2 + v1 * 9) % 11) % 10;

    return [v1, v2].join('');
}

function format(cpf) {
    if (!cpf) return '';

    cpf = cpf.toString().replace(/\D+/g, '');
    cpf = cpf.replace(/(\d{1,3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, '$1.$2.$3-$4');
    cpf = cpf.replace(/(\D+)$/, '');

    return cpf;
}

function generate() {
    var shuffleList = require('shuffle-list');
    var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var numbers = shuffleList(list).splice(0, 9);

    return format(numbers.join('') + dv(numbers));
}

function validate(cpf) {
    cpf = cpf.toString();
    if (/^\d{11}$/.test(cpf)) cpf = format(cpf);

    var re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (re.test(cpf)) {
        var regex = /^(1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11})$/;

        if (regex.test(cpf.replace(/\.|-/g, ''))) {
            return false;
        }

        var digs = cpf.split('-')[1];
        var nums = cpf.split('-')[0].match(/\d/g);

        return dv(nums) === digs
    } else {
        return false;
    }
}

module.exports = {
    format: format,
    generate: generate,
    validate: validate
};

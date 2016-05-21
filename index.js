'use strict';

var shuffleList = require('shuffle-list');

function dv(cpf) {
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

function format(cpf) {
    if (cpf === undefined) {
        return '';
    }

    cpf = cpf.toString().replace(/\D+/g, '');

    cpf = cpf.replace(/(\d{1,3})(\d{1,3})?(\d{1,3})?(\d{1,2})?/, '$1.$2.$3-$4');

    //Removes simbols at the end
    //Needed for backspace in browsers
    cpf = cpf.replace(/(\D+)$/, '');

    return cpf;
}

function generate() {
    var list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        numbers = shuffleList(list).splice(0, 9);

    return format(numbers.join('') + dv(numbers));
}

function validate(cpf) {
    cpf = cpf.toString();

    if (/^\d{11}$/.test(cpf)) {
        cpf = format(cpf);
    }

    var re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (re.test(cpf)) {
        var regex = /^(1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11})$/;

        if (regex.test(cpf.replace(/\.|-/g, ''))) {
            return false;
        }

        var digs = cpf.split('-')[1],
            nums = cpf.split('-')[0]
                .match(/\d/g);

        if (dv(nums) === digs) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

module.exports = {
    format: format,
    generate: generate,
    validate: validate
};

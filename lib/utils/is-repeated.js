"use strict";

const split = str => str.split("");

const reduce = val =>
       val.length === 0
       ? ""
       : val.reduce((a, b) => a === b ? a : "");

const isRepeated = str => Boolean(reduce(split(str)));

module.exports = isRepeated;


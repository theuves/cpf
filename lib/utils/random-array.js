"use strict";

const {from} = Array;

const {floor, random} = Math;

const rand = max => floor(random() * (max + 1));

const randomArray = (length, max) => from(Array(length), () => rand(max));

module.exports = randomArray;

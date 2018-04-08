"use strict";

const {isArray, from} = Array;

const reverseArray = array => isArray(array) ? from(array).reverse() : array;

module.exports = reverseArray;

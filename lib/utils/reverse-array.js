"use strict";

const {isArray, from} = Array;

module.exports = array => isArray(array)
  ? from(array).reverse()
  : array;

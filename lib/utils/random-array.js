"use strict";

const rand = max => Math.floor(Math.random() * (max + 1));

module.exports = (length, max) => Array.from(Array(length), () => rand(max));

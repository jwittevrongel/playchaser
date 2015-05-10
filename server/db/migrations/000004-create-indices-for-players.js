"use strict";

var playerRepository = require('../repository/player');

exports.schema = playerRepository.schemaName;

exports.up = function(db) {
    return playerRepository.open(db).initializeIndices();
};

exports.down = function(db) {
    return playerRepository.open(db).dropIndices();
};

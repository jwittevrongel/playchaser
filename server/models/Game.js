"use strict";

var mongoose = require('mongoose'),
    BaseGameSchema = require('./BaseGameSchema'),
    GameSchema = new BaseGameSchema();

module.exports = mongoose.model("Game", GameSchema);